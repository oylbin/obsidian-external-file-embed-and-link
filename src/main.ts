import { Editor, MarkdownView, Notice, Plugin } from 'obsidian';
import * as path from 'path';
import { getRelativePath, openFileWithDefaultProgram } from './utils';
import { CrossComputerLinkPluginSettings, DEFAULT_SETTINGS, CrossComputerLinkSettingTab } from './settings';
import { VirtualDirectoryManagerImpl } from './VirtualDirectoryManager';
import { getLocalMachineId } from './local-settings';
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
				console.log("relativePath", relativePath);
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
				defaultPath: selectedDirectoryPath,
				properties: ['openFile', 'multiSelections'],
				filters: [
					{ name: 'All Files', extensions: ['*'] }
				]
			});

			if (!result.canceled && result.filePaths.length > 0) {
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
