import { Editor, MarkdownView, Notice, Plugin, MarkdownPostProcessorContext, Platform } from 'obsidian';
import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs';
import { httpRequestHandler, findAvailablePort, CrossComputerLinkContext } from './server';
import { openFileWithDefaultProgram, getRelativePath, extractHeaderSection } from './utils';
import { CrossComputerLinkPluginSettings, DEFAULT_SETTINGS, CrossComputerLinkSettingTab, DragAction } from './settings';
import { parseEmbedArgumentWidthHeight, parseEmbedData, parseEmbedPdfArguments } from 'embedProcessor';


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



	private createEmbedRelativeToHome(editor: Editor, relativePath: string) {
		const text = "\n```EmbedRelativeToHome\n" + relativePath + "\n```\n";
		this.insertText(editor, text);
	}
	private createEmbedRelativeToVault(editor: Editor, relativePath: string) {
		const text = "\n```EmbedRelativeToVault\n" + relativePath + "\n```\n";
		this.insertText(editor, text);
	}
	private createLinkRelativeToHome(editor: Editor, relativePath: string) {
		const text = "\n```LinkRelativeToHome\n" + relativePath + "\n```\n";
		this.insertText(editor, text);
	}
	private createLinkRelativeToVault(editor: Editor, relativePath: string) {
		const text = "\n```LinkRelativeToVault\n" + relativePath + "\n```\n";
		this.insertText(editor, text);
	}
	private createInlineLinkRelativeToHome(editor: Editor, relativePath: string) {
		const text = " <a href=\"#\" class=\"LinkRelativeToHome\">" + relativePath + "</a> ";
		this.insertText(editor, text);
	}
	private createInlineLinkRelativeToVault(editor: Editor, relativePath: string) {
		const text = " <a href=\"#\" class=\"LinkRelativeToVault\">" + relativePath + "</a> ";
		this.insertText(editor, text);
	}

	private getActionFromEventKeys(event: DragEvent): DragAction {
		// console.log(`shift: ${event.shiftKey}, ctrl: ${event.ctrlKey}, alt: ${event.altKey}, meta: ${event.metaKey}`);
		if(Platform.isMacOS){
			if(event.altKey && event.shiftKey){
				return this.settings.dragWithCtrlShift;
			}else if(event.shiftKey){
				return this.settings.dragWithShift;
			}else if(event.altKey){
				return this.settings.dragWithCtrl;
			}else{
				return DragAction.Default;
			}
		}else{
			if(event.ctrlKey && event.shiftKey){
				return this.settings.dragWithCtrlShift;
			}else if(event.shiftKey){
				return this.settings.dragWithShift;
			}else if(event.ctrlKey){
				return this.settings.dragWithCtrl;
			}else{
				return DragAction.Default;
			}
		}
	}
	private handleDragEvent(event: DragEvent, editor: Editor) {
		// console.log("drop", event);
		const action = this.getActionFromEventKeys(event);
		if(action === DragAction.Default){
			return;
		}
		event.preventDefault();
		event.stopPropagation();

		const files = event.dataTransfer?.files;
		// console.log("files", files);
		if (files && files.length > 0) {
			// for each file
			for (let i = 0; i < files.length; i++) {
				// @ts-ignore Property 'path' exists at runtime but is not typed
				const fullpath = files[i].path;	
				if (action === DragAction.EmbedRelativeToHome) {
					const relativePath = getRelativePath(this.context.homeDirectory, fullpath);
					this.createEmbedRelativeToHome(editor, relativePath);
				} else if (action === DragAction.EmbedRelativeToVault) {
					const relativePath = getRelativePath(this.context.vaultDirectory, fullpath);
					this.createEmbedRelativeToVault(editor, relativePath);
				} else if (action === DragAction.LinkRelativeToHome) {
					const relativePath = getRelativePath(this.context.homeDirectory, fullpath);
					this.createLinkRelativeToHome(editor, relativePath);
				} else if (action === DragAction.LinkRelativeToVault) {
					const relativePath = getRelativePath(this.context.vaultDirectory, fullpath);
					this.createLinkRelativeToVault(editor, relativePath);
				}else if(action === DragAction.InlineLinkRelativeToHome){
					const relativePath = getRelativePath(this.context.homeDirectory, fullpath);
					this.createInlineLinkRelativeToHome(editor, relativePath);
				}else if(action === DragAction.InlineLinkRelativeToVault){
					const relativePath = getRelativePath(this.context.vaultDirectory, fullpath);
					this.createInlineLinkRelativeToVault(editor, relativePath);
				}
			}
		}
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
		if(this.manifest.dir){
			this.context.pluginDirectory = this.manifest.dir;
		}else{
			this.context.pluginDirectory = this.app.vault.configDir + '/plugins/' + this.manifest.id;
		}
		// console.log("vaultDirectory", this.vaultDirectory);
		// console.log("homeDirectory", this.homeDirectory);
		// @ts-ignore Property 'manifest' exists at runtime but is not typed
		//const pluginDirectory = this.app.vault.configDir + '/plugins/' + this.manifest.id;
		// console.log("vault object", this.app.vault);
		// console.log("manifest", this.manifest);

		this.startHttpServer();

		if(Platform.isMacOS || Platform.isWin){
			// only macos and windows support drag and drop currently, that need settings
			this.addSettingTab(new CrossComputerLinkSettingTab(this.app, this));
		}

		this.addCommand({
			id: 'add-external-embed-relative-to-home',
			name: 'Add external embed relative to home',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.showFilePickerAndCreateEmbed(
					editor, 
					this.context.homeDirectory, 
					this.createEmbedRelativeToHome.bind(this)
				);
			}
		});
		this.addCommand({
			id: 'add-external-link-relative-to-home',
			name: 'Add external link relative to home',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.showFilePickerAndCreateEmbed(editor, this.context.homeDirectory, this.createLinkRelativeToHome.bind(this));
			}
		});	
		this.addCommand({
			id: 'add-external-inline-link-relative-to-home',
			name: 'Add external inline link relative to home',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.showFilePickerAndCreateEmbed(editor, this.context.homeDirectory, this.createInlineLinkRelativeToHome.bind(this));
			}
		});

		this.addCommand({
			id: 'add-external-embed-relative-to-vault',
			name: 'Add external embed relative to vault',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.showFilePickerAndCreateEmbed(
					editor, 
					this.context.vaultDirectory, 
					this.createEmbedRelativeToVault.bind(this)
				);
			}
		});
		this.addCommand({
			id: 'add-external-link-relative-to-vault',
			name: 'Add external link relative to vault',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.showFilePickerAndCreateEmbed(editor, this.context.vaultDirectory, this.createLinkRelativeToVault.bind(this));
			}
		});
		this.addCommand({
			id: 'add-external-inline-link-relative-to-vault',
			name: 'Add external inline link relative to vault',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.showFilePickerAndCreateEmbed(editor, this.context.vaultDirectory, this.createInlineLinkRelativeToVault.bind(this));
			}
		});

		this.registerEvent(
			this.app.workspace.on("active-leaf-change", () => {
				// Clean up old event listeners
				if (this.cleanupDropHandler) {
					this.cleanupDropHandler();
					this.cleanupDropHandler = null;
				}

				const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (activeView) {
					const dropHandler = (event: DragEvent) => {
						// console.log("drop", event);
						if(this.settings.enableDragAndDrop){ // always enabled now
							this.handleDragEvent(event, activeView.editor);
						} else {
							// console.log("drag and drop is disabled");
						}
					};

					activeView.contentEl.addEventListener("drop", dropHandler, { capture: true });

					// Save cleanup function
					this.cleanupDropHandler = () => {
						activeView.contentEl.removeEventListener("drop", dropHandler, { capture: true });
					};
				}
			})
		);

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

		this.registerMarkdownPostProcessor((element, context) => {
			this.processInlineLink(element, context);
		});


	}

	private embedPdfWithIframe(embedUrl: string, embedArguments: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
		const iframe = document.createElement("iframe");
		// console.log("embedUrl", embedUrl);
		// console.log("embedArguments", embedArguments);
		const embedPdfArguments = parseEmbedPdfArguments(embedArguments);
		if(embedPdfArguments.page){
			iframe.src = embedUrl + "&page=" + embedPdfArguments.page;
		}else{
			iframe.src = embedUrl;
		}
		iframe.classList.add("external-embed-pdf-iframe");
		if (embedPdfArguments.width || embedPdfArguments.height) {
			iframe.classList.add("external-embed-pdf-iframe-custom-size");
			if(embedPdfArguments.width){
				iframe.style.setProperty("--iframe-width", embedPdfArguments.width);
			}
			if(embedPdfArguments.height){
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

	private embedOther(fullpath: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
		// Unsupported file type, display a link and modify onclick event
		const link = document.createElement("a");
		link.href = '#';
		link.textContent = path.basename(fullpath);
		link.addEventListener("click", () => {
			openFileWithDefaultProgram(fullpath, (error) => {
				if(error){
					new Notice("Failed to open file: " + error.message);
				}
			});
		});
		element.appendChild(link);
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
					if(error){
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
					if(error){
						new Notice("Failed to open file: " + error.message);
					}
				});
			});
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
				if(error){
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

	private processCodeBlockEmbed(relativeTo: "home" | "vault", source: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
		// Parse path
		let filePath = source.trim();
		if (filePath.startsWith("/")) {
			filePath = filePath.substring(1);
		}
		// https://help.obsidian.md/Linking+notes+and+files/Embed+files
		// When embedding pdf, use #page=3&height=400 to pass parameters 
		// When embedding image, use  |640x480 to pass parameters 
		// When embedding markdown document, use #headeringName or #^blockID to pass parameters 

		const embedData = parseEmbedData(filePath);
		// console.log("embedData", embedData);
		// check if filename contains '|', the text after '|' is the embed arguments
		const fileUrl = `http://127.0.0.1:${this.context.port}/download/${relativeTo === "home" ? "home" : "vault"}?p=${embedData.embedFilePath}`;
		if (embedData.embedType === 'pdf') {
			// this.embedPdf(fileUrl, embedData.embedArguments, element, context);
			const embedUrl = `http://127.0.0.1:${this.context.port}/embed/${relativeTo === "home" ? "home" : "vault"}?p=${embedData.embedFilePath}`;
			this.embedPdfWithIframe(embedUrl, embedData.embedArguments, element, context);
		} else if (embedData.embedType === 'image') {
			this.embedImage(fileUrl, embedData.embedArguments, element, context);
		} else if (embedData.embedType === 'video') {
			this.embedVideo(fileUrl, embedData.embedArguments, element, context);
		} else if (embedData.embedType === 'audio') {
			this.embedAudio(fileUrl, element, context);
		} else if (embedData.embedType === 'markdown') {
			const fullPath = `${relativeTo === "home" ? this.context.homeDirectory : this.context.vaultDirectory}/${embedData.embedFilePath}`;
			this.embedMarkdown(fullPath, embedData.embedArguments, element, context);
		} else {
			const fullPath = `${relativeTo === "home" ? this.context.homeDirectory : this.context.vaultDirectory}/${filePath}`;
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

	

	private async showFilePickerAndCreateEmbed(
		editor: Editor, 
		baseDir: string, 
		createEmbedFn: (editor: Editor, relativePath: string) => void
	) {
		// @ts-ignore
		const { remote } = require('electron');
		// const ImageExtensionsWithoutDot = ImageExtensions.map(ext => ext.substring(1));
		// const VideoExtensionsWithoutDot = VideoExtensions.map(ext => ext.substring(1));
		// const AudioExtensionsWithoutDot = AudioExtensions.map(ext => ext.substring(1));
		
		const result = await remote.dialog.showOpenDialog({
			properties: ['openFile', 'multiSelections'],
			filters: [
				{ name: 'All Files', extensions: ['*'] },
				// { name: 'Images', extensions: ImageExtensionsWithoutDot },
				// { name: 'PDF', extensions: ['pdf'] },
				// { name: 'Video', extensions: VideoExtensionsWithoutDot },
				// { name: 'Audio', extensions: AudioExtensionsWithoutDot }
			]
		});

		if (!result.canceled && result.filePaths.length > 0) {
			const filePaths = result.filePaths;
			// console.log("Selected files:", filePaths);
			
			filePaths.forEach((filePath: string) => {
				const relativePath = getRelativePath(baseDir, filePath);
				createEmbedFn(editor, relativePath);
			});
		}
	}
}
