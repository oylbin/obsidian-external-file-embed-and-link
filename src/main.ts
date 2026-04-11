import { Editor, MarkdownView, Notice, Plugin } from 'obsidian';
import * as path from 'path';
import { getRelativePath, openFileWithDefaultProgram } from './utils';
import { CrossComputerLinkPluginSettings, DEFAULT_SETTINGS, CrossComputerLinkSettingTab } from './settings';
import { VirtualDirectoryManagerImpl } from './VirtualDirectoryManager';
import { getLocalMachineId, loadLocalSettings, saveLocalSettings } from './local-settings';
// @ts-ignore
import { remote } from 'electron';
import { existsSync } from 'fs';
import { DirectorySelectionModal } from './DirectorySelectionModal';
import { EmbedProcessor } from './embedProcessor';
import { LinkProcessor } from './LinkProcessor';
import { HttpServer } from './HttpServer';
import { CrossComputerLinkContext } from './server';

export default class CrossComputerLinkPlugin extends Plugin {
	settings: CrossComputerLinkPluginSettings;
	private cleanupDropHandler: (() => void) | null = null;
	context: CrossComputerLinkContext;
	private httpServer: HttpServer;
	private embedProcessor: EmbedProcessor;
	private linkProcessor: LinkProcessor;
	// Remembers the last folder the user picked a file from, keyed by virtual
	// directory id. Persisted to device-local settings so it survives restarts.
	private lastPickedFolders: Record<string, string> = {};

	insertText(editor: Editor, text: string) {
		const cursor = editor.getCursor();
		editor.replaceRange(text, cursor);
		editor.setCursor({ line: cursor.line, ch: cursor.ch + text.length });
	}

	async onload() {
		await this.loadSettings();
		this.context = new CrossComputerLinkContext();
		this.context.homeDirectory = process.env.HOME || process.env.USERPROFILE || '';
		// @ts-ignore Property 'basePath' exists at runtime but is not typed
		this.context.vaultDirectory = this.app.vault.adapter.basePath;
		this.context.port = 11411;
		if (this.manifest.dir) {
			this.context.pluginDirectory = this.manifest.dir;
		} else {
			this.context.pluginDirectory = this.app.vault.configDir + '/plugins/' + this.manifest.id;
		}

		this.httpServer = new HttpServer(this.context);
		await this.httpServer.start();

		const localMachineId = await getLocalMachineId(this.manifest.id);
		const localSettings = await loadLocalSettings(this.manifest.id);
		this.lastPickedFolders = localSettings.lastPickedFolders ?? {};
		this.context.directoryConfigManager = new VirtualDirectoryManagerImpl(this, localMachineId);
		this.addSettingTab(new CrossComputerLinkSettingTab(this.app, this, this.context.directoryConfigManager, localMachineId));

		this.embedProcessor = new EmbedProcessor(this.context.port, this.context.directoryConfigManager);
		this.embedProcessor.load();
		this.linkProcessor = new LinkProcessor(
			this.context.homeDirectory,
			this.context.vaultDirectory,
			this.context.directoryConfigManager
		);

		this.addCommand({
			id: 'add-external-embed',
			name: 'Add external embed',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.handleAddExternalEmbed(editor);
			}
		});

		this.addCommand({
			id: 'add-external-inline-link',
			name: 'Add external inline link',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.handleAddExternalInlineLink(editor);
			}
		});

		this.registerMarkdownCodeBlockProcessor("LinkRelativeToHome", (source, el, ctx) => {
			this.linkProcessor.processCodeBlockLink("home", source, el, ctx);
		});

		this.registerMarkdownCodeBlockProcessor("LinkRelativeToVault", (source, el, ctx) => {
			this.linkProcessor.processCodeBlockLink("vault", source, el, ctx);
		});

		this.registerMarkdownCodeBlockProcessor("EmbedRelativeToHome", (source, el, ctx) => {
			this.embedProcessor.processEmbed("home", source, el, ctx, this.context.homeDirectory);
		});

		this.registerMarkdownCodeBlockProcessor("EmbedRelativeToVault", (source, el, ctx) => {
			this.embedProcessor.processEmbed("vault", source, el, ctx, this.context.vaultDirectory);
		});

		this.registerMarkdownCodeBlockProcessor("EmbedRelativeTo", (source, el, ctx) => {
			const fileUrl = source.trim();
			let directoryId: string;
			let relativePath: string;
			if (fileUrl.startsWith("./")) {
				directoryId = "vault";
				const directoryOfCurrentNote = path.dirname(ctx.sourcePath);
				relativePath = path.join(directoryOfCurrentNote, fileUrl.slice(2));
				// console.log("relativePath", relativePath);
			}else{
				[directoryId, relativePath] = fileUrl.split('://', 2);
			}
			const directoryPath = this.context.directoryConfigManager.getLocalDirectory(directoryId.toLowerCase());
			if (directoryPath) {
				this.embedProcessor.processEmbed(directoryId.toLowerCase(), relativePath, el, ctx, directoryPath);
			} else {
				this.embedProcessor.embedError([`Virtual directory "${directoryId}" is not configured.`, `Please configure the directory in settings.`], el, ctx);
			}
		});

		this.registerMarkdownPostProcessor((element, context) => {
			this.linkProcessor.processInlineLink(element, context);
		});

		// Document-level delegated click handler for `.LinkRelativeTo` inline
		// links. Markdown post-processors do not run in Live Preview (CM6), so
		// without this listener inline links are dead clicks in that mode.
		// Registering on `document` in the capture phase guarantees we run
		// before Obsidian's own hash-link handling, which would otherwise
		// either swallow the click or attempt an in-document anchor jump.
		// `registerDomEvent` ensures the listener is removed on plugin unload.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			const target = evt.target as HTMLElement | null;
			if (!target) return;
			const anchor = target.closest('a.LinkRelativeTo') as HTMLAnchorElement | null;
			if (!anchor) return;

			evt.preventDefault();
			evt.stopPropagation();

			this.linkProcessor.handleInlineLinkClick(anchor);
		}, { capture: true });
	}
	// Returns the path that should be passed as `defaultPath` to the file
	// picker for the given virtual directory. Falls back to the virtual
	// directory root when there is no remembered folder, when the remembered
	// folder no longer exists, or when it has fallen outside the virtual
	// directory (e.g. user changed the virtual directory's root in settings).
	private resolvePickerDefaultPath(directoryId: string, virtualRoot: string): string {
		const remembered = this.lastPickedFolders[directoryId];
		if (!remembered) {
			return virtualRoot;
		}

		const normalizedRoot = path.normalize(virtualRoot);
		const normalizedRemembered = path.normalize(remembered);

		if (!existsSync(normalizedRemembered)) {
			delete this.lastPickedFolders[directoryId];
			return virtualRoot;
		}

		const rel = path.relative(normalizedRoot, normalizedRemembered);
		// `rel` starts with '..' when `remembered` is outside the root, and
		// `path.isAbsolute(rel)` catches the Windows cross-drive case where
		// `path.relative` returns an absolute path.
		const inside = !rel.startsWith('..') && !path.isAbsolute(rel);
		if (!inside) {
			delete this.lastPickedFolders[directoryId];
			return virtualRoot;
		}

		return normalizedRemembered;
	}

	private async persistLastPickedFolders(): Promise<void> {
		try {
			const localSettings = await loadLocalSettings(this.manifest.id);
			localSettings.lastPickedFolders = this.lastPickedFolders;
			await saveLocalSettings(this.manifest.id, localSettings);
		} catch (e) {
			console.error('Failed to persist lastPickedFolders', e);
		}
	}

	private async selectFileAndCreateCode(editor: Editor,
		createCodeFn: (directoryId: string, filePath: string) => string) {
		const localDirectories = this.context.directoryConfigManager.getAllLocalDirectories();
		if (Object.keys(localDirectories).length === 0) {
			new Notice("No local directories configured. Please configure directories in settings first.");
			return;
		}

		const modal = new DirectorySelectionModal(this.app, localDirectories);
		modal.open();
		const selectedDirectoryId = await modal.waitForSelection();

		if (selectedDirectoryId) {
			const selectedDirectoryPath = localDirectories[selectedDirectoryId];

			if (!existsSync(selectedDirectoryPath)) {
				new Notice(`Virtual directory "${selectedDirectoryId}" points to "${selectedDirectoryPath}", but it does not exist. Please fix the directory in settings.`);
				return;
			}

			const result = await remote.dialog.showOpenDialog({
				defaultPath: this.resolvePickerDefaultPath(selectedDirectoryId, selectedDirectoryPath),
				properties: ['openFile', 'multiSelections'],
				filters: [
					{ name: 'All Files', extensions: ['*'] }
				]
			});

			if (!result.canceled && result.filePaths.length > 0) {
				// All files selected in a single dialog session live in the
				// same parent directory, so remembering the dirname of the
				// first one is enough.
				this.lastPickedFolders[selectedDirectoryId] = path.dirname(result.filePaths[0]);
				this.persistLastPickedFolders();

				result.filePaths.forEach((filePath: string) => {
					console.log("filePath", filePath);
					try {
						const relativePath = getRelativePath(selectedDirectoryPath, filePath);
						const embedCode = createCodeFn(selectedDirectoryId, relativePath);
						this.insertText(editor, embedCode);
					} catch (error) {
						new Notice(`Failed to create external embed or inline link for "${filePath}": ${error}`);
					}
				});
			}
		}
	}

	private async handleAddExternalEmbed(editor: Editor) {
		await this.selectFileAndCreateCode(editor, (directoryId: string, filePath: string) => {
			return `\n\`\`\`EmbedRelativeTo\n${directoryId}://${filePath}\n\`\`\`\n`;
		});
	}

	private async handleAddExternalInlineLink(editor: Editor) {
		await this.selectFileAndCreateCode(editor, (directoryId: string, filePath: string) => {
			return ` <a href="#${directoryId}://${filePath}" class="LinkRelativeTo">${path.basename(filePath)}</a> `;
		});
	}

	onunload() {
		this.httpServer.stop();
		this.embedProcessor.unload();
		if (this.cleanupDropHandler) {
			this.cleanupDropHandler();
			this.cleanupDropHandler = null;
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
