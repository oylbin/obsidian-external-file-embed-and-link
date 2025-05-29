import * as path from "path";
import { minimatch } from 'minimatch';
import { ImageExtensions, isAudio, isImage, isMarkdown, isPDF, isVideo, MarkdownExtensions, VideoExtensions } from "./utils";
import { MarkdownPostProcessorContext, Component } from 'obsidian';
import * as fs from 'fs';
import { openFileWithDefaultProgram } from './utils';
import { Notice } from 'obsidian';
import { extractHeaderSection } from './utils';
import { VirtualDirectoryManager } from "./VirtualDirectoryManager";

export class EmbedData {
	embedType: 'pdf' | 'image' | 'markdown' | 'audio' | 'video' | 'other' | 'folder';
	embedArguments: string;
	embedFilePath: string;
}

export class EmbedArgumentWidthHeight {
	width: number | undefined;
	height: number | undefined;
}

export class EmbedPdfArguments {
	page = 1;
	width = '100%';
	height = '80vh';
}

export class EmbedFolderArguments {
	extensions: string[] = []; // can filter files by extensions, separated by comma, eg. pdf,txt
	includePatterns: string[] = []; // can filter files by glob patterns, separated by comma, eg. *.pdf,*.txt
	excludePatterns: string[] = []; // can exclude files by glob patterns, separated by comma, eg. *.pdf,*.txt
}

export function parseEmbedFolderArguments(embedArguments: string): EmbedFolderArguments {
	console.log(`parseEmbedFolderArguments: ${embedArguments}`);
	const embedFolderArguments = new EmbedFolderArguments();
	const params = embedArguments.split('&');
	for (const param of params) {
		const [key, value] = param.split('=');
		if (key === 'extensions') {
			// Split the value by comma and add each extension to the array
			const extensions = value.split(',').map(ext => ext.trim().toLowerCase());
			embedFolderArguments.extensions.push(...extensions);
		}
		if (key === 'include') {
			const includePatterns = value.split(',').map(pattern => pattern.trim());
			embedFolderArguments.includePatterns.push(...includePatterns);
		}
		if (key === 'exclude') {
			const excludePatterns = value.split(',').map(pattern => pattern.trim());
			embedFolderArguments.excludePatterns.push(...excludePatterns);
		}
	}
	return embedFolderArguments;
}

export function parseEmbedPdfArguments(embedArguments: string): EmbedPdfArguments {
	const embedPdfArguments = new EmbedPdfArguments();
	// embedArguments can be in the following forms
	// width=100%&height=50vh&page=23
	// Parameters are optional and may not appear in any order.
	// However, parameters are in key=value format and separated by &.
	const params = embedArguments.split('&');
	for (const param of params) {
		const [key, value] = param.split('=');
		if (key === 'width') {
			embedPdfArguments.width = value;
		}
		if (key === 'height') {
			embedPdfArguments.height = value;
		}
		if (key === 'page') {
			embedPdfArguments.page = parseInt(value);
		}
	}
	return embedPdfArguments;
}

export function parseEmbedArgumentWidthHeight(embedArguments: string): EmbedArgumentWidthHeight {
	// embedArguments can be in the following forms
	// 1. a single number 400, which represents width
	// 2. two numbers 400x300, which represents width and height
	const embedArgumentWidthHeight = new EmbedArgumentWidthHeight();
	const dimensionMatch = embedArguments.match(/^(\d+)(?:x(\d+))?$/);
	if (dimensionMatch) {
		embedArgumentWidthHeight.width = parseInt(dimensionMatch[1]);
		if (dimensionMatch[2]) {
			embedArgumentWidthHeight.height = parseInt(dimensionMatch[2]);
		}
	}
	return embedArgumentWidthHeight;
}

export function filterFolderFiles(files: fs.Dirent[], embedFolderArguments: EmbedFolderArguments): fs.Dirent[] {
	// filter order: extensions -> includePatterns -> excludePatterns
	let filteredFiles = files;

	if (embedFolderArguments.extensions.length > 0) {
		filteredFiles = filteredFiles.filter(file => {
			const extension = path.extname(file.name).toLowerCase().slice(1);
			return embedFolderArguments.extensions.includes(extension);
		});
	}

	if (embedFolderArguments.includePatterns.length > 0) {
		filteredFiles = filteredFiles.filter(file => {
			const fileName = file.name.toLowerCase();
			return embedFolderArguments.includePatterns.some(pattern => {
				return minimatch(fileName, pattern);
			});
		});
	}

	if (embedFolderArguments.excludePatterns.length > 0) {
		filteredFiles = filteredFiles.filter(file => {
			const fileName = file.name.toLowerCase();
			return embedFolderArguments.excludePatterns.some(pattern => {
				return !minimatch(fileName, pattern);
			});
		});
	}

	return filteredFiles.sort((a, b) => a.name.localeCompare(b.name));
}

export function parseEmbedData(inputLine: string): EmbedData {
	// console.log("embed input: ", inputLine);
	inputLine = inputLine.trim();
	if (inputLine.startsWith("/")) {
		inputLine = inputLine.substring(1);
	}
	const lowerCaseNameWithArguments = path.basename(inputLine).toLowerCase();
	// console.log("lowerCaseNameWithArguments: ", lowerCaseNameWithArguments);

	/*
	refer to https://help.obsidian.md/Linking+notes+and+files/Embed+files
	possible forms of nameWithArguments

	test.pdf#page=3
	test.pdf#page=3&height=400
	
	test.md#headingName
	test.md#^blockID
	
	test.png|640x480
	test.png|640
	
	*/
	// FIXME I think use regex is better
	//console.log(lowerCaseNameWithArguments)
	//console.log(lowerCaseNameWithArguments.startsWith("#"))
	if (lowerCaseNameWithArguments.startsWith("#")) {
		const embedType = 'folder';
		const embedArguments = lowerCaseNameWithArguments.split('#')[1];
		const embedFilePath = inputLine.substring(0, inputLine.length - embedArguments.length - 1);
		return {
			embedType,
			embedArguments,
			embedFilePath,
		};
	}
	if (lowerCaseNameWithArguments.includes(".pdf#")) {
		const embedType = 'pdf';
		// TODO This is an inexact implementation, not considering the case where the file name contains #.
		const embedArguments = lowerCaseNameWithArguments.split('.pdf#')[1];
		// Remove the last embedArguments length plus 1 character from inputLine to correctly preserve the case of the file name
		const embedFilePath = inputLine.substring(0, inputLine.length - embedArguments.length - 1);
		return {
			embedType,
			embedArguments,
			embedFilePath,
		};
	}
	// for each of the extensions in MarkdownExtensions
	for (const ext of MarkdownExtensions) {
		const mark = ext + "#";
		if (lowerCaseNameWithArguments.includes(mark)) {
			const embedType = 'markdown';
			// can not use lowerCaseNameWithArguments as it have header name which will be used as embedArguments
			const embedArguments0 = lowerCaseNameWithArguments.split(mark)[1];
			const embedFilePath = inputLine.substring(0, inputLine.length - embedArguments0.length - 1);
			const embedArguments = inputLine.substring(embedFilePath.length + 1);
			// console.log("inputLine", inputLine);
			// console.log("embedArguments", embedArguments);
			// console.log("embedFilePath", embedFilePath);
			return {
				embedType,
				embedArguments,
				embedFilePath,
			};
		}
	}
	for (const ext of ImageExtensions) {
		const mark = ext + "|";
		if (lowerCaseNameWithArguments.includes(mark)) {
			const embedType = 'image';
			const embedArguments = lowerCaseNameWithArguments.split(mark)[1];
			const embedFilePath = inputLine.substring(0, inputLine.length - embedArguments.length - 1);
			return {
				embedType,
				embedArguments,
				embedFilePath,
			};
		}
	}
	for (const ext of VideoExtensions) {
		const mark = ext + "|";
		if (lowerCaseNameWithArguments.includes(mark)) {
			const embedType = 'video';
			const embedArguments = lowerCaseNameWithArguments.split(mark)[1];
			const embedFilePath = inputLine.substring(0, inputLine.length - embedArguments.length - 1);
			return {
				embedType,
				embedArguments,
				embedFilePath,
			};
		}
	}

	// ok, now is file without any embed arguments
	if (isImage(inputLine)) {
		const embedType = 'image';
		const embedFilePath = inputLine;
		return {
			embedType,
			embedArguments: '',
			embedFilePath,
		};
	}
	if (isVideo(inputLine)) {
		const embedType = 'video';
		const embedFilePath = inputLine;
		return {
			embedType,
			embedArguments: '',
			embedFilePath,
		};
	}
	if (isAudio(inputLine)) {
		const embedType = 'audio';
		const embedFilePath = inputLine;
		return {
			embedType,
			embedArguments: '',
			embedFilePath,
		};
	}
	if (isPDF(inputLine)) {
		const embedType = 'pdf';
		const embedFilePath = inputLine;
		return {
			embedType,
			embedArguments: '',
			embedFilePath,
		};
	}
	if (isMarkdown(inputLine)) {
		const embedType = 'markdown';
		const embedFilePath = inputLine;
		return {
			embedType,
			embedArguments: '',
			embedFilePath,
		};
	}
	return {
		embedType: 'other',
		embedArguments: '',
		embedFilePath: inputLine,
	};

}

export class EmbedProcessor extends Component {
	constructor(
		private port: number,
		private directoryConfigManager: VirtualDirectoryManager
	) {
		super();
	}

	onload() {
		// console.log("EmbedProcessor onload");
		// Register message event handler
		this.registerDomEvent(window, 'message', (event: MessageEvent) => {
			// console.log(event);
			if (event.data.type === 'openPdfFile') {
				const fullPath = event.data.fullPath;
				// console.log(`openPdfFile fullPath: ${fullPath}`);
				if (fullPath) {
					openFileWithDefaultProgram(fullPath, (error) => {
						if (error) {
							new Notice("Failed to open file: " + error.message);
						}
					});
				}
			}
		});
	}

	private embedPdfWithIframe(embedUrl: string, fullPath: string, embedArguments: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
		const iframe = document.createElement("iframe");
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

	private embedImage(fileUrl: string, filePath: string, embedArguments: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
		const embedArgumentWidthHeight = parseEmbedArgumentWidthHeight(embedArguments);

		// Create and configure image
		const img = document.createElement("img");
		if (embedArgumentWidthHeight.width) {
			img.width = embedArgumentWidthHeight.width;
		}
		if (embedArgumentWidthHeight.height) {
			img.height = embedArgumentWidthHeight.height;
		}
		img.src = fileUrl;
		img.classList.add("external-embed-image");
		img.title = "Click to open image with system default program";

		// Add click handler to open URL
		img.addEventListener("click", () => {
			openFileWithDefaultProgram(filePath, (error) => {
				if (error) {
					new Notice("Failed to open file: " + error.message);
				}
			});
		});

		element.appendChild(img);
	}

	private embedVideo(fileUrl: string, filePath: string, embedArguments: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
		const embedArgumentWidthHeight = parseEmbedArgumentWidthHeight(embedArguments);
		
		// Create container for video and button
		const container = document.createElement("div");
		container.classList.add("external-embed-video-container");

		// Create and configure video
		const video = document.createElement("video");
		video.src = fileUrl;
		video.controls = true;
		if (embedArgumentWidthHeight.width) {
			video.width = embedArgumentWidthHeight.width;
		}
		if (embedArgumentWidthHeight.height) {
			video.height = embedArgumentWidthHeight.height;
		}
		container.appendChild(video);

		// Create open file button
		const openButton = document.createElement("button");
		openButton.innerHTML = "🔗";
		openButton.title = "Open with system default program";
		openButton.classList.add("external-embed-open-button");
		openButton.addEventListener("click", () => {
			openFileWithDefaultProgram(filePath, (error) => {
				if (error) {
					new Notice("Failed to open file: " + error.message);
				}
			});
		});

		container.appendChild(openButton);
		element.appendChild(container);
	}

	private embedAudio(fileUrl: string, filePath: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
		// Create container for audio and button
		const container = document.createElement("div");
		container.classList.add("external-embed-audio-container");

		// Create and configure audio
		const audio = document.createElement("audio");
		audio.src = fileUrl;
		audio.controls = true;
		container.appendChild(audio);

		// Create open file button
		const openButton = document.createElement("button");
		openButton.innerHTML = "🔗";
		openButton.title = "Open with system default program";
		openButton.classList.add("external-embed-audio-open-button");
		openButton.addEventListener("click", () => {
			openFileWithDefaultProgram(filePath, (error) => {
				if (error) {
					new Notice("Failed to open file: " + error.message);
				}
			});
		});
		container.appendChild(openButton);

		element.appendChild(container);
	}

	private embedFolder(fullPath: string, embedArguments: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
		const folder = document.createElement("a");
		folder.href = "#";
		folder.textContent = path.basename(fullPath) + "/";
		folder.classList.add("external-embed-folder-header");
		folder.title = "Open folder with system default program";
		folder.addEventListener("click", () => {
			openFileWithDefaultProgram(fullPath, (error) => {
				if (error) {
					new Notice("Failed to open folder: " + error.message);
				}
			});
		});
		element.appendChild(folder);

		const embedFolderArguments = parseEmbedFolderArguments(embedArguments);
		console.log("embedFolderArguments", embedFolderArguments);
		const fileList = document.createElement("ul");
		fileList.classList.add("external-embed-folder-list");

		fs.readdir(fullPath, { withFileTypes: true }, (err, files) => {
			if (err) {
				const errorMsg = document.createElement("div");
				errorMsg.textContent = `Error reading folder: ${err.message}`;
				errorMsg.classList.add("external-embed-folder-error");
				element.appendChild(errorMsg);
				return;
			}

			const filteredFiles = filterFolderFiles(files, embedFolderArguments);
			console.log("Filtered files", filteredFiles);

			filteredFiles.forEach(file => {
				const listItem = document.createElement("li");
				const link = document.createElement("a");
				const fullFilePath = path.join(fullPath, file.name);
				// check file or folder
				if (file.isDirectory()) {
					link.href = "#";
					link.textContent = file.name + "/";
					link.title = "Click to open folder with system default program";
					link.classList.add("external-embed-folder-link");
				} else {
					link.href = "#";
					link.textContent = file.name;
					link.title = "Click to open file with system default program";
					link.classList.add("external-embed-file-link");
				}
				
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

	public embedError(errorMessage: string[] | string, element: HTMLElement, context: MarkdownPostProcessorContext) {
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

	private async embedMarkdown(fullPath: string, embedArguments: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
		const header = document.createElement("a");
		header.href = "#";
		header.classList.add("external-embed-markdown-header");
		header.title = "Open with system default program";
		
		if (embedArguments === '') {
			header.textContent = path.basename(fullPath);
		} else {
			header.textContent = path.basename(fullPath) + "#" + embedArguments;
		}

		header.addEventListener("click", () => {
			openFileWithDefaultProgram(fullPath, (error) => {
				if (error) {
					new Notice("Failed to open file: " + error.message);
				}
			});
		});

		element.appendChild(header);

		const markdownContent = await fs.promises.readFile(fullPath, 'utf-8');
		const htmlContent = await extractHeaderSection(markdownContent, embedArguments);

		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlContent, 'text/html');
		const nodes = Array.from(doc.body.children);
		nodes.forEach(node => {
			const importedNode = document.importNode(node, true);
			element.appendChild(importedNode);
		});
		element.classList.add("external-embed-markdown-element");
	}

	public processEmbed(directoryId: string, relativePath: string, element: HTMLElement, context: MarkdownPostProcessorContext, directoryPath: string) {
		if (!directoryPath) {
			const errorMessage = [
				`Can not embed file from "${directoryId}://${relativePath}"`,
				`You need to set the directory path for "${directoryId}" in the plugin settings.`
			];
			this.embedError(errorMessage, element, context);
			return;
		}

		let filePath = relativePath.trim();
		if (filePath.startsWith("/")) {
			filePath = filePath.substring(1);
		}

		const embedData = parseEmbedData(filePath);
		const fullPath = path.join(directoryPath, embedData.embedFilePath);
		
		if(!fs.existsSync(fullPath)) {
			const errorMessage = [
				`Can not embed file from "${directoryId}://${relativePath}"`,
				`The file "${fullPath}" does not exist.`
			];
			this.embedError(errorMessage, element, context);
			return;
		}

		const fileUrl = `http://127.0.0.1:${this.port}/download/${directoryId}?p=${encodeURIComponent(embedData.embedFilePath)}`;
		const embedUrl = `http://127.0.0.1:${this.port}/embed/${directoryId}?p=${encodeURIComponent(embedData.embedFilePath)}`;
		switch(embedData.embedType) {
			case 'pdf':
				this.embedPdfWithIframe(embedUrl, fullPath, embedData.embedArguments, element, context);
				break;
			case 'image':
				this.embedImage(fileUrl, fullPath, embedData.embedArguments, element, context);
				break;
			case 'video':
				this.embedVideo(fileUrl, fullPath, embedData.embedArguments, element, context);
				break;
			case 'audio':
				this.embedAudio(fileUrl, fullPath, element, context);
				break;
			case 'markdown':
				this.embedMarkdown(fullPath, embedData.embedArguments, element, context);
				break;
			case 'folder':
				this.embedFolder(fullPath, embedData.embedArguments, element, context);
				break;
			default:
				this.embedOther(fullPath, element, context);
		}
	}
}
