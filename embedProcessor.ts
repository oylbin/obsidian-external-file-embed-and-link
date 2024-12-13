import * as path from "path";
import { ImageExtensions, isAudio, isImage, isMarkdown, isPDF, isVideo, MarkdownExtensions, VideoExtensions } from "utils";

export class EmbedData {
	embedType : 'pdf' | 'image' | 'markdown' | 'audio' | 'video' | 'other';
	embedArguments : string;
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

export function parseEmbedPdfArguments(embedArguments: string): EmbedPdfArguments {
	const embedPdfArguments = new EmbedPdfArguments();
	// embedArguments can be in the following forms
	// width=100%&height=50vh&page=23
	// Parameters are optional and may not appear in any order.
	// However, parameters are in key=value format and separated by &.
	const params = embedArguments.split('&');
	for(const param of params) {
		const [key, value] = param.split('=');
		if(key === 'width') {
			embedPdfArguments.width = value;
		}
		if(key === 'height') {
			embedPdfArguments.height = value;
		}
		if(key === 'page') {
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

export function parseEmbedData(inputLine: string): EmbedData {
	console.log("embed input: ", inputLine);
	inputLine = inputLine.trim();
	if (inputLine.startsWith("/")) {
		inputLine = inputLine.substring(1);
	}
	const lowerCaseNameWithArguments = path.basename(inputLine).toLowerCase();
	console.log("lowerCaseNameWithArguments: ", lowerCaseNameWithArguments);

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
	if(lowerCaseNameWithArguments.includes(".pdf#")) {
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
	for(const ext of MarkdownExtensions) {
		const mark = ext + "#";
		if(lowerCaseNameWithArguments.includes(mark)) {
			const embedType = 'markdown';
			const embedArguments = lowerCaseNameWithArguments.split(mark)[1];
			const embedFilePath = inputLine.substring(0, inputLine.length - embedArguments.length - 1);
			return {
				embedType,
				embedArguments,
				embedFilePath,
			};
		}
	}
	for(const ext of ImageExtensions) {
		const mark = ext + "|";
		if(lowerCaseNameWithArguments.includes(mark)) {
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
	for(const ext of VideoExtensions) {
		const mark = ext + "|";
		if(lowerCaseNameWithArguments.includes(mark)) {
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
	if(isImage(inputLine)) {
		const embedType = 'image';
		const embedFilePath = inputLine;
		return {
			embedType,
			embedArguments: '',
			embedFilePath,
		};
	}
	if(isVideo(inputLine)) {
		const embedType = 'video';
		const embedFilePath = inputLine;
		return {
			embedType,
			embedArguments: '',
			embedFilePath,
		};
	}
	if(isAudio(inputLine)) {
		const embedType = 'audio';
		const embedFilePath = inputLine;
		return {
			embedType,
			embedArguments: '',
			embedFilePath,
		};
	}
	if(isPDF(inputLine)) {
		const embedType = 'pdf';
		const embedFilePath = inputLine;
		return {
			embedType,
			embedArguments: '',
			embedFilePath,
		};
	}
	if(isMarkdown(inputLine)) {
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
