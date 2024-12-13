import { Editor, MarkdownView, Notice, Plugin, MarkdownPostProcessorContext } from 'obsidian';
import * as http from 'http';
import * as path from 'path';
import { httpRequestHandler, findAvailablePort } from './server';
import { openFileWithDefaultProgram, getRelativePath } from './utils';
import { CrossComputerLinkPluginSettings, DEFAULT_SETTINGS, CrossComputerLinkSettingTab } from './settings';
import { parseEmbedArgumentWidthHeight, parseEmbedData, parseEmbedPdfArguments } from 'embedProcessor';


export default class CrossComputerLinkPlugin extends Plugin {
	settings: CrossComputerLinkPluginSettings;
	homeDirectory: string;
	vaultDirectory: string;
	server: http.Server | null;
	private cleanupDropHandler: (() => void) | null = null;


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

	private getActionFromEventKeys(event: DragEvent): 'default' | 'LinkRelativeToHome' | 'LinkRelativeToVault' | 'EmbedRelativeToHome' | 'EmbedRelativeToVault' | 'InlineLinkRelativeToHome' | 'InlineLinkRelativeToVault' {
		const platform = process.platform;
		// console.log(`platform: ${platform}, shift: ${event.shiftKey}, ctrl: ${event.ctrlKey}, alt: ${event.altKey}, meta: ${event.metaKey}`);
		if(platform === 'darwin'){
			if(event.altKey && event.shiftKey){
				return this.settings.dragWithCtrlShift;
			}else if(event.shiftKey){
				return this.settings.dragWithShift;
			}else if(event.altKey){
				return this.settings.dragWithCtrl;
			}else{
				return 'default';
			}
		}else{
			if(event.ctrlKey && event.shiftKey){
				return this.settings.dragWithCtrlShift;
			}else if(event.shiftKey){
				return this.settings.dragWithShift;
			}else if(event.ctrlKey){
				return this.settings.dragWithCtrl;
			}else{
				return 'default';
			}
		}
		return 'default';
	}
	private handleDragEvent(event: DragEvent, editor: Editor) {
		// console.log("drop", event);
		const action = this.getActionFromEventKeys(event);
		if(action === 'default'){
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
				if (action === "EmbedRelativeToHome") {
					const relativePath = getRelativePath(this.homeDirectory, fullpath);
					this.createEmbedRelativeToHome(editor, relativePath);
				} else if (action === "EmbedRelativeToVault") {
					const relativePath = getRelativePath(this.vaultDirectory, fullpath);
					this.createEmbedRelativeToVault(editor, relativePath);
				} else if (action === "LinkRelativeToHome") {
					const relativePath = getRelativePath(this.homeDirectory, fullpath);
					this.createLinkRelativeToHome(editor, relativePath);
				} else if (action === "LinkRelativeToVault") {
					const relativePath = getRelativePath(this.vaultDirectory, fullpath);
					this.createLinkRelativeToVault(editor, relativePath);
				}else if(action === "InlineLinkRelativeToHome"){
					const relativePath = getRelativePath(this.homeDirectory, fullpath);
					this.createInlineLinkRelativeToHome(editor, relativePath);
				}else if(action === "InlineLinkRelativeToVault"){
					const relativePath = getRelativePath(this.vaultDirectory, fullpath);
					this.createInlineLinkRelativeToVault(editor, relativePath);
				}
			}
		}
	}
	private startHttpServer() {
		findAvailablePort(this.settings.httpServerPort)
		.then((port: number) => {
			if (port !== this.settings.httpServerPort) {
				new Notice(`Port ${this.settings.httpServerPort} was in use. Using port ${port} instead.`);
				this.settings.httpServerPort = port;
				this.saveSettings();
			}
	
			const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
				httpRequestHandler(req, res, this.homeDirectory, this.vaultDirectory);
			});
	
			server.listen(port, "127.0.0.1", () => {
				console.log(`HTTP server is running on port ${port}`);
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
		this.homeDirectory = process.env.HOME || process.env.USERPROFILE || '';
		// @ts-ignore Property 'basePath' exists at runtime but is not typed
		this.vaultDirectory = this.app.vault.adapter.basePath;
		// console.log("vaultDirectory", this.vaultDirectory);
		// console.log("homeDirectory", this.homeDirectory);

		// console.log("home relative to vault", this.filePathRelativeToVault(this.homeDirectory));
		// console.log("vault relative to home", this.filePathRelativeToHome(this.vaultDirectory));
		// console.log("synology drive folder relative to home", this.filePathRelativeToHome("c:/Users/oylb/SynologyDrive"));
		this.startHttpServer();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new CrossComputerLinkSettingTab(this.app, this));

		this.addCommand({
			id: 'add-external-embed-relative-to-home',
			name: 'Add External Embed Relative to Home',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.showFilePickerAndCreateEmbed(
					editor, 
					this.homeDirectory, 
					this.createEmbedRelativeToHome.bind(this)
				);
			}
		});
		this.addCommand({
			id: 'add-external-link-relative-to-home',
			name: 'Add External Link Relative to Home',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.showFilePickerAndCreateEmbed(editor, this.homeDirectory, this.createLinkRelativeToHome.bind(this));
			}
		});	
		this.addCommand({
			id: 'add-external-inline-link-relative-to-home',
			name: 'Add External Inline Link Relative to Home',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.showFilePickerAndCreateEmbed(editor, this.homeDirectory, this.createInlineLinkRelativeToHome.bind(this));
			}
		});

		this.addCommand({
			id: 'add-external-embed-relative-to-vault',
			name: 'Add External Embed Relative to Vault',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.showFilePickerAndCreateEmbed(
					editor, 
					this.vaultDirectory, 
					this.createEmbedRelativeToVault.bind(this)
				);
			}
		});
		this.addCommand({
			id: 'add-external-link-relative-to-vault',
			name: 'Add External Link Relative to Vault',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.showFilePickerAndCreateEmbed(editor, this.vaultDirectory, this.createLinkRelativeToVault.bind(this));
			}
		});
		this.addCommand({
			id: 'add-external-inline-link-relative-to-vault',
			name: 'Add External Inline Link Relative to Vault',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				this.showFilePickerAndCreateEmbed(editor, this.vaultDirectory, this.createInlineLinkRelativeToVault.bind(this));
			}
		});

		

		// this.addCommand({
		// 	id: 'paste-filename-as-external-link-embed',
		// 	name: 'Paste filename as External Embed',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		this.pasteFilenameAsExternalEmbed(editor);
		// 	}
		// });


		// this.registerEvent(this.app.workspace.on("editor-menu", (menu, editor, view) => {
		// 	menu.addItem((item) => {
		// 		item.setTitle("Paste filename as External Link").setIcon("link").onClick(() => {
		// 			this.pasteFilenameAsExternalLink(editor);
		// 		});
		// 	});
		// 	menu.addItem((item) => {
		// 		item.setTitle("Paste filename as External Embed").setIcon("link").onClick(() => {
		// 			this.pasteFilenameAsExternalEmbed(editor);
		// 		});
		// 	});
		// }));

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

	private embedPdf(fileUrl: string, embedArguments: string, element: HTMLElement, context: MarkdownPostProcessorContext) {

		const container = document.createElement("div");
		container.classList.add("pdf-container");
		// Add <canvas> element
		const canvas = document.createElement("canvas");
		canvas.id = "pdf-canvas";
		container.appendChild(canvas);

		// Insert container into rendering area
		element.appendChild(container);
		this.loadExternalScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js")
			.then(() => {
				// console.log("PDF.js loaded!");
				this.renderPdf(fileUrl, canvas);
			})
			.catch((error) => {
			console.error("Failed to load PDF.js:", error);
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
		if(embedPdfArguments.width){
			iframe.style.width = embedPdfArguments.width;
		}
		if(embedPdfArguments.height){
			iframe.style.height = embedPdfArguments.height;
		}
		iframe.style.border = "none";
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
			const fullPath = this.homeDirectory + "/" + relativePath;
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
			const fullPath = this.vaultDirectory + "/" + relativePath;
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
		const fullPath = `${relativeTo === "home" ? this.homeDirectory : this.vaultDirectory}/${filePath}`;

		// Extract file name
		const fileName = filePath.split("/").pop();

		// Create HTML link
		const link = document.createElement("a");
		//			link.href = `file://${fullPath}`;
		link.href = "#"
		link.textContent = fileName ?? "Unknown file";
		link.style.cursor = "pointer";

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
		const fileUrl = `http://127.0.0.1:${this.settings.httpServerPort}/download/${relativeTo === "home" ? "home" : "vault"}?p=${embedData.embedFilePath}`;
		if (embedData.embedType === 'pdf') {
			// this.embedPdf(fileUrl, embedData.embedArguments, element, context);
			const embedUrl = `http://127.0.0.1:${this.settings.httpServerPort}/embed/${relativeTo === "home" ? "home" : "vault"}?p=${embedData.embedFilePath}`;
			this.embedPdfWithIframe(embedUrl, embedData.embedArguments, element, context);
		} else if (embedData.embedType === 'image') {
			this.embedImage(fileUrl, embedData.embedArguments, element, context);
		} else if (embedData.embedType === 'video') {
			this.embedVideo(fileUrl, embedData.embedArguments, element, context);
		} else if (embedData.embedType === 'audio') {
			this.embedAudio(fileUrl, element, context);
		} else if (embedData.embedType === 'markdown') {
			//this.embedMarkdown(fileUrl, embedData.embedArguments, element, context);
		} else {
			const fullPath = `${relativeTo === "home" ? this.homeDirectory : this.vaultDirectory}/${filePath}`;
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
	// Tool function to dynamically load external scripts
	private loadExternalScript(url: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const script = document.createElement("script");
			script.src = url;
			script.type = "text/javascript";
			script.onload = () => resolve();
			script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
			document.head.appendChild(script);
		});
	}
	// Render PDF to canvas
	private async renderPdf(url: string, canvas: HTMLCanvasElement) {
		const ctx = canvas.getContext("2d");

		// Check if PDF.js is successfully loaded
		if (!(window as any)["pdfjsLib"]) {
			console.error("PDF.js library not loaded.");
			return;
		}

		const pdfjsLib = (window as any)["pdfjsLib"];
		pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";

		// Get PDF document
		try {
			const pdf = await pdfjsLib.getDocument(url).promise;
			const page = await pdf.getPage(1); // Render first page

			// Set viewport and canvas size
			const viewport = page.getViewport({ scale: 1.5 });
			canvas.width = viewport.width;
			canvas.height = viewport.height;

			// Render PDF page to canvas
			const renderContext = {
				canvasContext: ctx,
				viewport: viewport,
			};
			await page.render(renderContext).promise;
		} catch (error) {
			console.error("Failed to render PDF:", error);
		}
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
