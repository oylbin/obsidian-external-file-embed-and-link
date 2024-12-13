import { exec } from 'child_process';
import * as path from 'path';

export function customEncodeURI(uri: string) {
	return uri.replace(/[ #&%?]/g, function (c) {
		return encodeURIComponent(c);
	});
}

export function openFileWithDefaultProgram(filePath: string, onError: (error: Error) => void) {
	const platform = process.platform;
	let command = "";
	if (platform === "win32") {
		command = `start "" "${filePath}"`;
	} else if (platform === "darwin") {
		command = `open "${filePath}"`;
	} else if (platform === "linux") {
		command = `xdg-open "${filePath}"`;
	}
	exec(command, onError);
}

export function getRelativePath(from: string, to: string) {
	from = path.normalize(from);
	to = path.normalize(to);
	const relativePath = path.relative(from, to);
	return relativePath.replace(/\\/g, '/');
}
export function getContentType(extname: string) {
	extname = extname.toLowerCase();
	const _map: { [key: string]: string } = {
		'.png': 'image/png',
		'.jpg': 'image/jpeg',
		'.jpeg': 'image/jpeg',
		'.gif': 'image/gif',
		'.bmp': 'image/bmp',
		'.webp': 'image/webp',
		'.pdf': 'application/pdf',
		'.mp3': 'audio/mpeg',
		'.mp4': 'video/mp4',
		'.webm': 'video/webm',
		'.ogg': 'audio/ogg',
	};
	if (_map[extname]) {
		return _map[extname];
	}
	return 'application/octet-stream';
}

export const ImageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg', '.avif'];
export const VideoExtensions = ['.mp4', '.webm', '.mkv', '.mov', '.ogv'];
export const AudioExtensions = ['.mp3', '.ogg', '.wav', '.flac', '.m4a', '.webm'];
export const MarkdownExtensions = ['.md', '.markdown'];

export function isImage(fullpath: string) {
	const extname = path.extname(fullpath).toLowerCase();
	return ImageExtensions.includes(extname);
}
export function isVideo(fullpath: string) {
	const extname = path.extname(fullpath).toLowerCase();
	return VideoExtensions.includes(extname);
}

export function isAudio(fullpath: string) {
	const extname = path.extname(fullpath).toLowerCase();
	return AudioExtensions.includes(extname);
}
export function isMarkdown(fullpath: string) {
	const extname = path.extname(fullpath).toLowerCase();
	return MarkdownExtensions.includes(extname);
}

export function isPDF(fullpath: string) {
	const extname = path.extname(fullpath).toLowerCase();
	return extname === '.pdf';
}

export function parseUrlParams(params: string|undefined): { [key: string]: string } {
	if(!params){
		return {};
	}
	const paramDict: { [key: string]: string } = {};
	const paramPairs = params.split('&');
	for (const pair of paramPairs) {
		const [key, value] = pair.split('=');
		if (key && value) {
			paramDict[decodeURIComponent(key)] = decodeURIComponent(value);
		}
	}
	return paramDict;
}


