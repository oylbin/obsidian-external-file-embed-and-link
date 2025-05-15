import * as http from 'http';
import * as net from 'net';
import * as path from 'path';
import * as fs from 'fs';
import { getContentType, openFileWithDefaultProgram, parseUrlParams } from './utils';

import pdf_viewer_min_css from 'inline:./assets/pdf_viewer.css';
import pdf_min_js from 'inline:./assets/pdf.js';
import pdf_worker_min_js from 'inline:./assets/pdf.worker.js';
import { VirtualDirectoryManager } from './VirtualDirectoryManager';
import { InlineAssetHandler } from './InlineAssetHandler';

const UNSUPPORTED_FILE_TEMPLATE = `
<html>
<body>
	<p>Unsupported file type.</p>
	<a href="URL_TO_REPLACE">FILENAME_TO_REPLACE</a>
</body>
</html>
`

export class CrossComputerLinkContext {
	homeDirectory: string;
	vaultDirectory: string;
	port: number;
	pluginDirectory: string;
	directoryConfigManager: VirtualDirectoryManager;
}

export async function getTemplate(extname: string) {
	extname = extname.toLowerCase();
	const _map: { [key: string]: () => Promise<string> } = {
		'.pdf': async () => {
			const template = await import('inline:./templates/pdf.html');
			return template.default;
		},
	};
	if (_map[extname]) {
		return await _map[extname]();
	}
	return null;
}

export function findAvailablePort(startPort: number): Promise<number> {
	return new Promise((resolve, reject) => {
		const server = net.createServer();
		
		server.on('error', (err: NodeJS.ErrnoException) => {
			if (err.code === 'EADDRINUSE') {
				let nextPort = startPort + 1;
				if(nextPort > 65535) {
					nextPort = 11411;
				}
				// Port is in use, try the next one
				findAvailablePort(nextPort)
					.then(resolve)
					.catch(reject);
			} else {
				reject(err);
			}
		});

		server.listen(startPort, '127.0.0.1', () => {
			const port = (server.address() as net.AddressInfo).port;
			server.close(() => resolve(port));
		});
	});
}

function getFilePathFromUrl(url: string, context: CrossComputerLinkContext) {

	// url should be in the following format:
	// /download/{directoryId}?p={encodedFilePath}
	// /open/{directoryId}?p={encodedFilePath}
	// /embed/{directoryId}?p={encodedFilePath}

	// console.log("getFilePathFromUrl", url);
	const [urlWithoutParams, params] = url.split('?');
	const parsedParams = parseUrlParams(params);
	// console.log("urlWithoutParams", urlWithoutParams);
	// console.log("parsedParams", parsedParams);

	const directoryId = urlWithoutParams.split('/')[2];
	const decodedPath = decodeURIComponent(parsedParams.p);

	const directoryPath = context.directoryConfigManager.getLocalDirectory(directoryId);
	if(!directoryPath) {
		throw new Error("Invalid directory id: " + directoryId);
	}

	const filePath = path.join(directoryPath, decodedPath);
	return filePath;
}
export async function embedRequestHandler(url: string, req: http.IncomingMessage, res: http.ServerResponse, context: CrossComputerLinkContext) {
	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	// url may contain ? followed by parameters, split url and parameters
	const [, params] = url.split('?');
	const parsedParams = parseUrlParams(params);
	console.log("parsedParams", parsedParams);
	const extname = path.extname(parsedParams.p).toLowerCase();
	const template = await getTemplate(extname);
	if (template) {
		const downloadUrl = url.replace("/embed/", "/download/");
		let multiLineStr = template.replace("URL_TO_REPLACE", downloadUrl).replace("FILENAME_TO_REPLACE", path.basename(url));
		if(extname === '.pdf'){
			// TODO Currently only pdf embed is supported, and only pdf has parameters. If there are more embed types in the future, better organization of code is needed.
			// Here params should be in the form of page=123
			if(parsedParams.page === undefined){
				parsedParams.page = "1";
			}
			multiLineStr = multiLineStr.replace("PAGE_TO_REPLACE", parsedParams.page);
			multiLineStr = multiLineStr.replace(/PORT_TO_REPLACE/g, context.port.toString());
		}
		res.end(multiLineStr);
	} else {
		const openUrl = url.replace("/embed/", "/open/");
		const multiLineStr = UNSUPPORTED_FILE_TEMPLATE.replace("URL_TO_REPLACE", openUrl).replace("FILENAME_TO_REPLACE", path.basename(url));
		res.end(multiLineStr);
	}
}
export function downloadRequestHandler(url: string, req: http.IncomingMessage, res: http.ServerResponse, context: CrossComputerLinkContext) {
	const filePath = getFilePathFromUrl(url, context);
	const extname = path.extname(filePath).toLowerCase();
	const contentType = getContentType(extname);
	if (!fs.existsSync(filePath)) {
		res.writeHead(404, { 'Content-Type': 'text/plain' });
		res.end('File not found');
		return;
	}
	
	if(req.method === "OPTIONS") {
		// Some browsers send OPTIONS requests (pre-flight requests) before cross-domain requests. The server needs to correctly handle OPTIONS requests.
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
		res.end();
		return;
	}
	const stat = fs.statSync(filePath);

	if(req.method === "HEAD") {
		// Return only file type and size information, without returning data
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
		res.setHeader('Content-Type', contentType);
		res.setHeader('Content-Length', stat.size);
		res.end();
		return;
	}
	const range = req.headers.range;
	if(range) {
		// Parse Range request header
		const [start, end] = range.replace(/bytes=/, '').split('-').map(Number);
		const fileStart = start || 0;
		const fileEnd = end || stat.size - 1;
		const contentLength = fileEnd - fileStart + 1;

		res.writeHead(206, {
			'Content-Range': `bytes ${fileStart}-${fileEnd}/${stat.size}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': contentLength,
			'Content-Type': contentType,
		});

		const stream = fs.createReadStream(filePath, { start: fileStart, end: fileEnd });
		stream.pipe(res);
		return;
	}else{
		// Normal request, return the entire file
		res.writeHead(200, {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			'Content-Length': stat.size,
			'Content-Type': contentType,
		});

		const stream = fs.createReadStream(filePath);
		stream.pipe(res);
	}
}
function openRequestHandler(url: string, req: http.IncomingMessage, res: http.ServerResponse, context: CrossComputerLinkContext) {
	const filePath = getFilePathFromUrl(url, context);
	// console.log("filePath", filePath);
	openFileWithDefaultProgram(filePath, (error: Error) => {
		if(error){
			console.error("Failed to open file:", error);
		}
	});

	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	const multiLineStr = `
		<html>
			<body>
				<p>Opening file: ${filePath}</p>
				<p>This window may not be automatically closed. You may close it manually.</p>
				<script>
					setTimeout(function() {
						window.close();
					}, 1000);
				</script>
			</body>
		</html>
		`;
	res.end(multiLineStr);
}
async function assetRequestHandler(url: string, req: http.IncomingMessage, res: http.ServerResponse, context: CrossComputerLinkContext) {
	console.log("assetRequestHandler", url);
	if(url === "/assets/pdf_viewer.min.css") {
		res.setHeader('Content-Type', 'text/css');
		res.end(pdf_viewer_min_css);
	}else if(url === "/assets/pdf.min.js") {
		res.setHeader('Content-Type', 'application/javascript');
		res.end(pdf_min_js);
	}else if(url === "/assets/pdf.worker.min.js") {	
		res.setHeader('Content-Type', 'application/javascript');
		res.end(pdf_worker_min_js);
	}else if(url.startsWith("/assets/pdfjs-5.2.133-dist/web/viewer.html")) {
		res.setHeader('Content-Type', 'text/html');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/viewer.html');
		res.end(content.default);
	}else{
		await InlineAssetHandler(url, req, res);
	}
}

function errorResponse(res: http.ServerResponse, code: number, message: string) {
	res.writeHead(code);
	res.end(message);
}
export async function httpRequestHandler(req: http.IncomingMessage, res: http.ServerResponse, context: CrossComputerLinkContext) {
	// console.log("httpRequestHandler", req.url);
	// Read file content and return it via http response
	const url = req.url;
	if(!url) {
		return errorResponse(res, 404, "Invalid path");
	}
	// console.log("url", url);
	try{
		if(url.startsWith("/embed/")) {
			await embedRequestHandler(url, req, res, context);
			return;
		}else if(url.startsWith("/download/")) {
			downloadRequestHandler(url, req, res, context);
			return;
		}else if(url.startsWith("/open/")) {
			openRequestHandler(url, req, res, context);
			return;
		}else if(url.startsWith("/assets/")) {
			console.log("assets", url);
			await assetRequestHandler(url, req, res, context);
			return;
		}
	}catch(error){
		console.error("Error in httpRequestHandler", error);
		return errorResponse(res, 500, `Internal error: ${error}`);
	}

	return errorResponse(res, 404, `Invalid path ${url}`);
}

