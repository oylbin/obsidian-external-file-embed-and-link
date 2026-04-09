# Changelog

All notable changes to the External File Embed and Link plugin will be documented in this file.

## [Unreleased]

### Changed (DevOps)

- Standardized DevOps workflow: introduced a new `Makefile` + `dev.sh` following the
  "standardized entry, scripted logic" philosophy. All `lint` / `build` / `test` /
  `clean` operations now run inside a `node:18-alpine` container managed by
  `docker-compose.yml`. Host only needs Docker.
- Added `make` targets: `help`, `doctor`, `deps`, `lint`, `build`, `clean`, `test`,
  `up`, `down`, `restart`, `status`, `logs`, `shell`, `artifacts`, `install`, `release`.
- `make install` is the only host-side target — it copies build artifacts to the
  Obsidian plugin directory configured by `VAULT_PLUGIN_DIR` in `.env`.
- `esbuild.config.mjs` no longer auto-copies build outputs to a test vault.
  The `dotenv` runtime dependency has been removed.
- **Migration**: rename `TEST_VAULT_PLUGIN_DIR` in your local `.env` to
  `VAULT_PLUGIN_DIR`, and point it to your real Obsidian plugin folder. See
  `.env.example` for the template. The old `make install` / `make download`
  targets have been replaced by the new standardized targets.

## [1.5.7]

- Remember the last folder used per virtual directory when picking files for `Add external embed` / `Add external inline link`, so consecutive picks in the same folder no longer need to navigate from the root each time. Memory is per session and per virtual directory.

## [1.5.6]

- Add include/exclude options for embed folder [#14](https://github.com/oylbin/obsidian-external-file-embed-and-link/issues/14)

## [1.5.5]

- Fix issue with pdfjs viewer image rendering [#7](https://github.com/oylbin/obsidian-external-file-embed-and-link/issues/7)

## [1.5.4]

- Fix issue with special characters in file paths [#13](https://github.com/oylbin/obsidian-external-file-embed-and-link/issues/13)

## [1.5.3]

- Add better file type identity for folders [#11](https://github.com/oylbin/obsidian-external-file-embed-and-link/issues/11)

## [1.5.2]

### Added

- Add a button or clickable text to open the embedded files

## [1.5.1]

### Added

- Make text in pdf embed copyable and searchable

## [1.5.0]

### Added
- **Virtual Directory System**: Introduced a flexible virtual directory system
  - No longer limited to using home or vault directories as starting paths
  - Map any local directory to a virtual directory ID
  - Configure different paths per device for the same virtual directory ID
  - Format: `VirtualDirectoryId://relative/path/to/file`
  - Home and vault directories are pre-defined as virtual directories

- **New Commands**: Streamlined command palette options
  - `Add external embed`: Opens a dialog to select a virtual directory and file for embedding
  - `Add external inline link`: Opens a dialog to select a virtual directory and file for linking
  - Both commands generate the appropriate code automatically

- **Improved Error Handling**: More descriptive error messages
  - Detailed context information when files cannot be found
  - Clearer guidance on how to resolve common issues

### Changed
- **New Embed Syntax**: Introduced `EmbedRelativeTo` as the preferred syntax
  ```
  ```EmbedRelativeTo
  home://SynologyDrive/README.md
  ```
  ```
  - Legacy `EmbedRelativeToHome` and `EmbedRelativeToVault` still supported but deprecated

- **New Link Syntax**: Introduced `LinkRelativeTo` as the preferred syntax
  - New: `<a href="#home://Makefile" class="LinkRelativeTo">Makefile</a>`
  - Legacy class attributes `LinkRelativeToHome` and `LinkRelativeToVault` still supported but deprecated

### Removed
- **Drag & Drop Functionality**: Temporarily disabled
  - With multiple virtual directories, determining the correct target directory from drag & drop became ambiguous
  - May be reimplemented in the future with a directory selection dialog
  - Commands now provide a more controlled alternative for adding embeds and links 
