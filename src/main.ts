import { Editor, MarkdownView, Notice, Plugin, MarkdownPostProcessorContext, Modal, App } from 'obsidian';
import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs';
import { httpRequestHandler, findAvailablePort, CrossComputerLinkContext } from './server';
import { openFileWithDefaultProgram, getRelativePath, extractHeaderSection } from './utils';
import { CrossComputerLinkPluginSettings, DEFAULT_SETTINGS, CrossComputerLinkSettingTab } from './settings';
import { VirtualDirectoryManagerImpl } from './VirtualDirectoryManager';
import { parseEmbedArgumentWidthHeight, parseEmbedData, parseEmbedFolderArguments, parseEmbedPdfArguments } from './embedProcessor';
import { getLocalMachineId } from './local-settings';
// @ts-ignore
import { remote } from 'electron';
import { existsSync } from 'fs';

class DirectorySelectionModal extends Modal {
	private selectedDirectoryId: string | null = null;
	private resolvePromise: ((value: string | null) => void) | null = null;

	constructor(
		app: App,
		private directories: Record<string, string>
	) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		// Add title
		contentEl.createEl('h2', {
			text: 'Which virtual directory to use for the link',
			cls: 'external-embed-modal-title'
		});

		// Create container for directory buttons with vertical layout
		const buttonContainer = contentEl.createDiv('directory-buttons-container');
		
		// Add a button for each directory
		Object.entries(this.directories).forEach(([id, path]) => {
			const button = buttonContainer.createEl('button', {
				text: `${id} (${path})`,
				cls: 'external-embed-directory-button'
			});
			
			button.addEventListener('click', () => {
				this.selectedDirectoryId = id;
				this.close();
			});
		});
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
		if (this.resolvePromise) {
			this.resolvePromise(this.selectedDirectoryId);
		}
	}

	async waitForSelection(): Promise<string | null> {
		return new Promise((resolve) => {
			this.resolvePromise = resolve;
		});
	}
}

export default class CrossComputerLinkPlugin extends Plugin {
	settings: CrossComputerLinkPluginSettings;
	// homeDirectory: string;
	// vaultDirectory: string;
	server: http.Server | null;
	private cleanupDropHandler: (() => void) | null = null;
	context: CrossComputerLinkContext;


	insertText(editor: Editor, text: string) {
		// Get cursor position
		const cursor = editor.getCursor();
		// Insert text at cursor position
		editor.replaceRange(text, cursor);
		// Update cursor position
		editor.setCursor({ line: cursor.line, ch: cursor.ch + text.length });
	}

	private startHttpServer() {
		findAvailablePort(this.context.port)
			.then((port: number) => {
				if (port !== this.context.port) {
					//new Notice(`Port ${this.context.port} was in use. Using port ${port} instead.`);
					this.context.port = port;
					//this.saveSettings();
				}

				const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
					httpRequestHandler(req, res, this.context);
				});

				server.listen(port, "127.0.0.1", () => {
					//console.log(`HTTP server is running on port ${port}`);
				});
				server.on('error', (e: NodeJS.ErrnoException) => {
					if (e.code === 'EADDRINUSE') {
						new Notice(`Port ${port} is already in use. Please choose a different port in settings.`);
					} else {
						new Notice(`Failed to start HTTP server: ${e.message}`);
					}
					this.server = null;
				});

				this.server = server;
			})
			.catch((err: Error) => {
				new Notice(`Failed to start HTTP server: ${err.message}`);
				this.server = null;
			});
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
		// console.log("vaultDirectory", this.vaultDirectory);
		// console.log("homeDirectory", this.homeDirectory);
		// @ts-ignore Property 'manifest' exists at runtime but is not typed
		//const pluginDirectory = this.app.vault.configDir + '/plugins/' + this.manifest.id;
		// console.log("vault object", this.app.vault);
		// console.log("manifest", this.manifest);

		this.startHttpServer();

		const localMachineId = await getLocalMachineId(this.manifest.id);
		this.context.directoryConfigManager = new VirtualDirectoryManagerImpl(this, localMachineId);
		this.addSettingTab(new CrossComputerLinkSettingTab(this.app, this, this.context.directoryConfigManager, localMachineId));

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


		// keep LinkRelativeToHome and LinkRelativeToVault for backward compatibility
		// no plan to support LinkRelativeTo, use inline link instead
		//  <a href="#" class="LinkRelativeTo" directoryId="home">SynologyDrive/test.pdf</a>
		this.registerMarkdownCodeBlockProcessor("LinkRelativeToHome", (source, el, ctx) => {
			this.processCodeBlockLink("home", source, el, ctx);
		});
		this.registerMarkdownCodeBlockProcessor("LinkRelativeToVault", (source, el, ctx) => {
			this.processCodeBlockLink("vault", source, el, ctx);
		});



		this.registerMarkdownCodeBlockProcessor("EmbedRelativeToHome", (source, el, ctx) => {
			this.processCodeBlockEmbed("home", source, el, ctx);
		});
		this.registerMarkdownCodeBlockProcessor("EmbedRelativeToVault", (source, el, ctx) => {
			this.processCodeBlockEmbed("vault", source, el, ctx);
		});

		this.registerMarkdownCodeBlockProcessor("EmbedRelativeTo", (source, el, ctx) => {
			this.processEmbedRelativeTo(source, el, ctx);
		});

		this.registerMarkdownPostProcessor((element, context) => {
			this.processInlineLink(element, context);
		});


	}

	private async selectFileAndCreateCode(editor: Editor, 
        createCodeFn: (directoryId: string, filePath: string) => string) {
		const localDirectories = this.context.directoryConfigManager.getAllLocalDirectories();
		if (Object.keys(localDirectories).length === 0) {
			new Notice("No local directories configured. Please configure directories in settings first.");
			return;
		}

		// Show directory selection modal
		const modal = new DirectorySelectionModal(this.app, localDirectories);
		modal.open();
		const selectedDirectoryId = await modal.waitForSelection();

		if (selectedDirectoryId) {
			const selectedDirectoryPath = localDirectories[selectedDirectoryId];

			// check if the directory exists
			if (!existsSync(selectedDirectoryPath)) {
				new Notice(`Virtual directory "${selectedDirectoryId}" points to "${selectedDirectoryPath}", but it does not exist. Please fix the directory in settings.`);
				return;
			}

			// Show file picker for selected directory
			const result = await remote.dialog.showOpenDialog({
				defaultPath: selectedDirectoryPath,
				properties: ['openFile', 'multiSelections'],
				filters: [
					{ name: 'All Files', extensions: ['*'] }
				]
			});

			if (!result.canceled && result.filePaths.length > 0) {
				result.filePaths.forEach((filePath: string) => {
					try{
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

	private embedPdfWithIframe(embedUrl: string, embedArguments: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
		const iframe = document.createElement("iframe");
		// console.log("embedUrl", embedUrl);
		// console.log("embedArguments", embedArguments);
		const embedPdfArguments = parseEmbedPdfArguments(embedArguments);
		if (embedPdfArguments.page) {
			iframe.src = embedUrl + "&page=" + embedPdfArguments.page;
		} else {
			iframe.src = embedUrl;
		}
		iframe.classList.add("external-embed-pdf-iframe");
		if (embedPdfArguments.width || embedPdfArguments.height) {
			iframe.classList.add("external-embed-pdf-iframe-custom-size");
			if (embedPdfArguments.width) {
				iframe.style.setProperty("--iframe-width", embedPdfArguments.width);
			}
			if (embedPdfArguments.height) {
				iframe.style.setProperty("--iframe-height", embedPdfArguments.height);
			}
		}
		element.appendChild(iframe);
	}

	private embedImage(fileUrl: string, embedArguments: string, element: HTMLElement, context: MarkdownPostProcessorContext) {

		const embedArgumentWidthHeight = parseEmbedArgumentWidthHeight(embedArguments);

		const img = document.createElement("img");

		if (embedArgumentWidthHeight.width) {
			img.width = embedArgumentWidthHeight.width;
		}
		if (embedArgumentWidthHeight.height) {
			img.height = embedArgumentWidthHeight.height;
		}
		img.src = fileUrl;
		element.appendChild(img);
	}

	private embedVideo(fileUrl: string, embedArguments: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
		const embedArgumentWidthHeight = parseEmbedArgumentWidthHeight(embedArguments);
		const video = document.createElement("video");
		video.src = fileUrl;
		video.controls = true;
		if (embedArgumentWidthHeight.width) {
			video.width = embedArgumentWidthHeight.width;
		}
		if (embedArgumentWidthHeight.height) {
			video.height = embedArgumentWidthHeight.height;
		}
		element.appendChild(video);
	}

	private embedAudio(fileUrl: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
		const audio = document.createElement("audio");
		audio.src = fileUrl;
		audio.controls = true;
		element.appendChild(audio);
	}

	private embedFolder(fullPath: string, embedArguments: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
		// console.log("embedFolder", fullPath);
		const folder = document.createElement("div");
		folder.textContent = path.basename(fullPath);
		folder.classList.add("external-embed-folder-header");
		element.appendChild(folder);

		const embedFolderArguments = parseEmbedFolderArguments(embedArguments);
		// console.log("embedFolderArguments", embedFolderArguments);

		// Create container for file list as UL element
		const fileList = document.createElement("ul");
		fileList.classList.add("external-embed-folder-list");

		// Read directory contents
		fs.readdir(fullPath, { withFileTypes: true }, (err, files) => {
			if (err) {
				const errorMsg = document.createElement("div");
				errorMsg.textContent = `Error reading folder: ${err.message}`;
				errorMsg.classList.add("external-embed-folder-error");
				element.appendChild(errorMsg);
				return;
			}

			// Filter files by extensions if specified
			let filteredFiles = files;
			if (embedFolderArguments.extensions) {
				const allowedExtensions = embedFolderArguments.extensions.split(',').map(ext => ext.trim().toLowerCase());
				filteredFiles = files.filter(file => {
					const extension = path.extname(file.name).toLowerCase().slice(1);
					return allowedExtensions.includes(extension);
				});
			}

			// Sort files alphabetically
			filteredFiles.sort((a, b) => a.name.localeCompare(b.name));

			filteredFiles.forEach(file => {
				const listItem = document.createElement("li");
				const link = document.createElement("a");
				link.href = "#";
				link.textContent = file.name;

				const fullFilePath = path.join(fullPath, file.name);
				link.addEventListener("click", () => {
					openFileWithDefaultProgram(fullFilePath, (error) => {
						if (error) {
							new Notice("Failed to open file: " + error.message);
						}
					});
				});

				listItem.appendChild(link);
				fileList.appendChild(listItem);
			});
		});

		element.appendChild(fileList);
	}

	private embedOther(fullpath: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
		// Unsupported file type, display a link and modify onclick event
		const link = document.createElement("a");
		link.href = '#';
		link.textContent = path.basename(fullpath);
		link.addEventListener("click", () => {
			openFileWithDefaultProgram(fullpath, (error) => {
				if (error) {
					new Notice("Failed to open file: " + error.message);
				}
			});
		});
		element.appendChild(link);
	}

	private embedError(errorMessage: string[] | string, element: HTMLElement, context: MarkdownPostProcessorContext) {
		const errorDiv = document.createElement("div");
		if (Array.isArray(errorMessage)) {
			errorMessage.forEach(msg => {
				const errorMsg = document.createElement("div");
				errorMsg.textContent = msg;
				errorDiv.appendChild(errorMsg);
			});
		} else {
			const errorMsg = document.createElement("div");
			errorMsg.textContent = errorMessage;
			errorDiv.appendChild(errorMsg);
		}
		errorDiv.classList.add("external-embed-error");
		element.appendChild(errorDiv);
	}


	private processInlineLink(
		element: HTMLElement,
		context: MarkdownPostProcessorContext
	) {
		// console.log("processLinkRelativeToHome", element, context);
		// Find elements with LinkRelativeToHome class
		element.querySelectorAll('.LinkRelativeToHome').forEach((el) => {
			const relativePath = el.textContent?.trim();
			const fullPath = this.context.homeDirectory + "/" + relativePath;
			el.textContent = path.basename(fullPath);

			// Modifying href here is not effective, clicking will cause Not allowed to load local resource error
			// Modify its onclick event instead
			el.addEventListener("click", () => {
				openFileWithDefaultProgram(fullPath, (error) => {
					if (error) {
						new Notice("Failed to open file: " + error.message);
					}
				});
			});
		});
		element.querySelectorAll('.LinkRelativeToVault').forEach((el) => {
			const relativePath = el.textContent?.trim();
			const fullPath = this.context.vaultDirectory + "/" + relativePath;
			el.textContent = path.basename(fullPath);

			// Modifying href here is not effective, clicking will cause Not allowed to load local resource error
			// Modify its onclick event instead
			el.addEventListener("click", () => {
				openFileWithDefaultProgram(fullPath, (error) => {
					if (error) {
						new Notice("Failed to open file: " + error.message);
					}
				});
			});
		});
		element.querySelectorAll('.LinkRelativeTo').forEach((el) => {
			try{
				// console.log("LinkRelativeTo", el);
				const url0 = el.getAttribute('href');
				if (!url0) {
					throw new Error(`href is not set for link "${el.textContent}"`);
				}
				// remove the first #
				const url = url0.substring(1);
				const directoryId = url.split(':')[0];
				if (!directoryId) {
					throw new Error(`Failed to extract directoryId from href "${url0}" for link "${el.textContent}"`);
				}
				const relativePath = url.split(':')[1];
				if (!relativePath) {
					throw new Error(`Failed to extract relativePath from href "${url0}" for link "${el.textContent}"`);
				}
				const direcotryPath = this.context.directoryConfigManager.getLocalDirectory(directoryId);
				if (!direcotryPath) {
					throw new Error(`Virtual directory "${directoryId}" not found for link "${el.textContent}"`);
				}
				const fullPath = path.join(direcotryPath, relativePath);
				if(!existsSync(fullPath)) {
					throw new Error(`Virtual file url "${url0}" is resolved to non-existent file "${fullPath}" for link "${el.textContent}"`);
				}
				el.textContent = path.basename(fullPath);
				el.addEventListener("click", () => {
					openFileWithDefaultProgram(fullPath, (error) => {
						if (error) {
							new Notice("Failed to open file: " + error.message);
						}
					});
				});
			} catch(error){
				el.addEventListener("click", () => {
					new Notice(`Inline link error: ${error.message}`);
				});
			}
		});
	}

	private processCodeBlockLink(relativeTo: "home" | "vault", source: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
		// Parse path
		let filePath = source.trim();
		if (filePath.startsWith("/")) {
			filePath = filePath.substring(1);
		}
		const fullPath = `${relativeTo === "home" ? this.context.homeDirectory : this.context.vaultDirectory}/${filePath}`;

		// Extract file name
		const fileName = filePath.split("/").pop();

		// Create HTML link
		const link = document.createElement("a");
		//			link.href = `file://${fullPath}`;
		link.href = "#"
		link.textContent = fileName ?? "Unknown file";

		// Click event, use Obsidian's API to open file
		link.addEventListener("click", () => {
			// Below is to open file in obsidian
			//this.app.workspace.openLinkText(filePath, "", false);

			openFileWithDefaultProgram(fullPath, (error) => {
				if (error) {
					new Notice("Failed to open file: " + error.message);
				}
			});
		});

		// Insert rendered content
		element.appendChild(link);
	}

	private async embedMarkdown(fullPath: string, embedArguments: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
		// console.log("fullPath", fullPath);
		// console.log("embedArguments", embedArguments);

		// create a header element to show the filename
		const header = document.createElement("h2");
		if (embedArguments === '') {
			header.textContent = path.basename(fullPath);
		} else {
			header.textContent = path.basename(fullPath) + "#" + embedArguments;
		}
		element.appendChild(header);


		const markdownContent = await fs.promises.readFile(fullPath, 'utf-8');
		const htmlContent = await extractHeaderSection(markdownContent, embedArguments);
		// Using innerHTML, outerHTML or similar API's is a security risk. 
		//Instead, use the DOM API or the Obsidian helper functions: https://docs.obsidian.md/Plugins/User+interface/HTML+elements
		// element.innerHTML = htmlContent;

		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlContent, 'text/html');
		const nodes = Array.from(doc.body.children);
		nodes.forEach(node => {
			const importedNode = document.importNode(node, true);
			element.appendChild(importedNode);
		});
		element.classList.add("external-embed-markdown-element");
	}

	private processCodeBlockEmbed(directoryId: string, relativePath: string, element: HTMLElement, context: MarkdownPostProcessorContext) {

		const direcotryPath = this.context.directoryConfigManager.getLocalDirectory(directoryId);
		if (!direcotryPath) {
			const errorMessage = [
				`Can not embed file from "${directoryId}://${relativePath}"`,
				`You need to set the directory path for "${directoryId}" in the plugin settings.`
			];
			this.embedError(errorMessage, element, context);
			return;
		}

		// Parse path
		let filePath = relativePath.trim();
		if (filePath.startsWith("/")) {
			filePath = filePath.substring(1);
		}
		// https://help.obsidian.md/Linking+notes+and+files/Embed+files
		// When embedding pdf, use #page=3&height=400 to pass parameters 
		// When embedding image, use  |640x480 to pass parameters 
		// When embedding markdown document, use #headeringName or #^blockID to pass parameters 

		const embedData = parseEmbedData(filePath);
		// console.log("embedData", embedData);
		const fullPath = path.join(direcotryPath, embedData.embedFilePath);
		if(!existsSync(fullPath)) {
			const errorMessage = [
				`Can not embed file from "${directoryId}://${relativePath}"`,
				`The file "${fullPath}" does not exist.`
			];
			this.embedError(errorMessage, element, context);
			return;
		}
		// check if filename contains '|', the text after '|' is the embed arguments
		const fileUrl = `http://127.0.0.1:${this.context.port}/download/${directoryId}?p=${embedData.embedFilePath}`;
		if (embedData.embedType === 'pdf') {
			// this.embedPdf(fileUrl, embedData.embedArguments, element, context);
			const embedUrl = `http://127.0.0.1:${this.context.port}/embed/${directoryId}?p=${embedData.embedFilePath}`;
			this.embedPdfWithIframe(embedUrl, embedData.embedArguments, element, context);
		} else if (embedData.embedType === 'image') {
			this.embedImage(fileUrl, embedData.embedArguments, element, context);
		} else if (embedData.embedType === 'video') {
			this.embedVideo(fileUrl, embedData.embedArguments, element, context);
		} else if (embedData.embedType === 'audio') {
			this.embedAudio(fileUrl, element, context);
		} else if (embedData.embedType === 'markdown') {
			const fullPath = path.join(direcotryPath, embedData.embedFilePath);
			this.embedMarkdown(fullPath, embedData.embedArguments, element, context);
		} else if (embedData.embedType === 'folder') {
			const fullPath = path.join(direcotryPath, embedData.embedFilePath);
			this.embedFolder(fullPath, embedData.embedArguments, element, context);
		} else {
			const fullPath = path.join(direcotryPath, embedData.embedFilePath);
			this.embedOther(fullPath, element, context);
		}
	}

	onunload() {
		if (this.server) {
			this.server.close();
		}
		// Ensure cleanup event listeners when plugin is unloaded
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

	private processEmbedRelativeTo(source: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
		const fileUrl = source.trim();
		// the format of fileUrl is like this:
		// home://SynologyDrive/test.pdf
		// vault://../test.pdf
		// Project123://docs/license.txt
		// {custom-directory-id}://{relative-path}
		// we need to extract the relative path from the fileUrl
		const [directoryId, relativePath] = fileUrl.split('://', 2);
		this.processCodeBlockEmbed(directoryId.toLowerCase(), relativePath, element, context);
	}
}
