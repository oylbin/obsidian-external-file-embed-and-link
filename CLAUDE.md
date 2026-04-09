# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Workflow

This project uses a **containerized DevOps workflow**. **Never run `npm` directly on the host.** All build/test/lint operations execute inside a `node:18-alpine` container managed by `docker-compose.yml`. The Makefile is the single entry point and forwards every target to `dev.sh`.

The host only needs Docker (with Compose v2) and bash. Node.js is **not** required on the host.

### Common commands

- `make build` — production build (`tsc -noEmit && esbuild production`) inside the container
- `make test` — Jest unit tests inside the container
- `make lint` — ESLint inside the container
- `make doctor` — verify Docker / Compose / `.env` configuration
- `make help` — list every available target
- `make install` — **only host-side target**; copies `main.js`, `styles.css`, `manifest.json` to `$VAULT_PLUGIN_DIR` (configured in `.env`) so you can test in a real Obsidian vault

After verifying changes that affect compiled output or test correctness, run `make build` and `make test` to confirm nothing is broken.

### Long-running iteration

For interactive work, keep the dev container alive:

- `make up` — start the dev container with `esbuild --watch` in the background
- `make logs` — follow esbuild output
- `make shell` — open a shell inside the dev container
- `make restart` / `make status` / `make down`

When the dev container is running, `make test` / `make lint` / `make build` `exec` into it. Otherwise `dev.sh` falls back to a one-shot `docker compose run --rm`, which auto-installs `node_modules` if missing.

### Running a single test

There is no make target for a single test. From inside `make shell`:

```sh
npx jest src/embedProcessor.test.ts                 # one file
npx jest -t "should parse single extensions"        # one test by name
```

### Where logic lives

- `Makefile` — declares targets only; forwards to `dev.sh`. **Do not put logic here.**
- `dev.sh` — all command implementations: the `compose` v2/v1 wrapper, container-running detection, one-shot fallback, cross-platform `file_mtime`, the release flow, etc.
- `docker-compose.yml` — `node:18-alpine` + a **named volume** for `node_modules` to avoid host/container binary mismatches (notably esbuild's native binaries on Windows). This means `node_modules` is **not visible on the host filesystem**; if you want IDE intellisense, run `npm install` on the host independently — that's optional and outside the containerized workflow.

When extending the workflow, add the new command to `dev.sh` first, then expose it as a thin target in the `Makefile`.

### Release

`make release VERSION=x.y.z` bumps the version inside the container (`npm version --no-git-tag-version`), commits the bump on the host, creates a local git tag, and prints push instructions. The GitHub Actions workflow on tag push handles the actual GitHub release.

## Architecture

This is an Obsidian plugin that lets users **embed and link files outside the vault** using virtual-directory-prefixed paths like `home://Documents/foo.pdf` or `myproject://docs/spec.md`. The point of virtual directories is **cross-device portability**: the same note can map a virtual directory to different absolute paths on each device.

### Entry point and lifecycle

`src/main.ts` (`CrossComputerLinkPlugin`) wires everything together in `onload()`:

1. Builds a `CrossComputerLinkContext` (`src/server.ts`) holding `homeDirectory`, `vaultDirectory`, `port`, `pluginDirectory`, and the `directoryConfigManager`. This context is the shared state passed to the HTTP server and processors.
2. Starts a **local HTTP server** (`HttpServer` in `src/HttpServer.ts`) bound to `127.0.0.1`, default port `11411`, with `findAvailablePort` fallback. The server (`httpRequestHandler` in `src/server.ts`) is what serves embedded file content (PDFs, images, audio, video, markdown) into the rendered note via `<iframe>`/`<img>`/etc. tags pointing at `http://127.0.0.1:<port>/...`.
3. Loads/initializes per-device settings via `getLocalMachineId` (`src/local-settings.ts`), which generates a UUID stored under the plugin directory so each device has a stable identity.
4. Creates the `VirtualDirectoryManagerImpl` (`src/VirtualDirectoryManager.ts`), which owns the mapping `virtualDirectoryId -> { perDeviceUUID -> absolutePath }` persisted in plugin settings. `home` and `vault` are reserved/built-in IDs; user-defined IDs must match `^[a-zA-Z0-9]+$`.
5. Instantiates `EmbedProcessor` (`src/embedProcessor.ts`) and `LinkProcessor` (`src/LinkProcessor.ts`) and registers them as Markdown code-block processors and a post-processor:
   - ` ```EmbedRelativeTo ` — modern, generic form: `directoryId://relative/path` (also supports `./relative` meaning relative to the current note inside the vault)
   - ` ```EmbedRelativeToHome ` / ` ```EmbedRelativeToVault ` — legacy hardcoded forms
   - ` ```LinkRelativeToHome ` / ` ```LinkRelativeToVault ` — legacy link forms
   - `<a class="LinkRelativeTo" href="#dirId://path">` — inline link form, handled by `linkProcessor.processInlineLink` in a markdown post-processor
6. Adds two commands (`add-external-embed`, `add-external-inline-link`) that use `DirectorySelectionModal` (`src/DirectorySelectionModal.ts`) and Electron's `remote.dialog.showOpenDialog` to let the user pick a virtual directory + file, then insert the appropriate code block / inline link.

`onunload()` stops the HTTP server and unloads the embed processor.

### Embed pipeline

`EmbedProcessor.processEmbed(directoryId, source, el, ctx, directoryRoot)`:

1. Parses the source into `EmbedData { embedType, embedArguments, embedFilePath }`. `embedType` is one of `pdf | image | markdown | audio | video | folder | other`, derived from extension helpers in `src/utils.ts` (`isPDF`, `isImage`, `isAudio`, `isVideo`, `isMarkdown`).
2. For folders (path ends with `/`), parses arguments via `parseEmbedFolderArguments` (supports `extensions=`, `include=` glob, `exclude=` glob via `minimatch`) and renders a list of links/embeds.
3. For PDFs, parses `page=`, `width=`, `height=` via `parseEmbedPdfArguments`. The PDF is rendered through a bundled `templates/pdf.html` (inlined at build time by `esbuild-plugin-inline-import`, see the `inline:` import in `src/server.ts`'s `getTemplate`) loaded into an iframe pointed at the local HTTP server. PDF.js is used inside the template.
4. For images/videos, parses `width|height` via `parseEmbedArgumentWidthHeight`.
5. For markdown, optionally extracts a header section via `extractHeaderSection` in `src/utils.ts`.
6. Files are served via `http://127.0.0.1:<port>/<directoryId>/<relativePath>`. The HTTP handler resolves this back to an absolute path using the `VirtualDirectoryManager` and streams the file with the right `Content-Type` (see `getContentType` in `src/utils.ts`). `InlineAssetHandler` (`src/InlineAssetHandler.ts`) handles assets the PDF template needs to fetch.

### Link pipeline

`LinkProcessor` handles two cases:

- **Code-block link** (` ```LinkRelativeToHome ` / `Vault`): renders an `<a>` whose click handler invokes `openFileWithDefaultProgram` (`src/utils.ts`, uses Electron `shell.openPath` / OS-specific fallback).
- **Inline link** (`<a class="LinkRelativeTo" href="#dirId://path">`): the markdown post-processor walks rendered HTML, finds these anchors, resolves the path through `VirtualDirectoryManager`, and rewires the click handler to open the file with the OS default app rather than navigating.

### Settings

`src/settings.ts` defines `CrossComputerLinkPluginSettings`:

```
{
  devices: { [uuid]: { uuid, name, os } },
  virtualDirectories: { [virtualDirId]: { [deviceUuid]: absolutePath } }
}
```

`CrossComputerLinkSettingTab` is the UI for managing devices and virtual directories. The "current device" UUID is read from `local-settings.ts` (per-vault file outside the synced settings, so each device gets a stable identity even when settings are synced via Obsidian Sync).

### Build

`esbuild.config.mjs` bundles `src/main.ts` -> `main.js` (CJS, target `es2018`), externalizing `obsidian`, `electron`, all `@codemirror/*` and `@lezer/*`, and Node builtins. `esbuild-plugin-inline-import` resolves `inline:` imports (used for the PDF template HTML) at build time. Production mode minifies and disables sourcemaps.

### Tests

Jest + ts-jest. The Obsidian API is mocked via `src/__mocks__/obsidian.ts` (mapped through `jest.config.js`'s `moduleNameMapper`). Test files live alongside the code (e.g. `src/embedProcessor.test.ts`).

## Coding rules

- Do **not** use Chinese in code or comments (from `.cursor/rules/obsidian-plugin-developer.mdc`).
- Source language is TypeScript. Target Obsidian + Electron + Node 18.
