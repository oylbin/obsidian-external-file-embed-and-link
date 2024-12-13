import * as http from 'http';
import * as net from 'net';
import * as path from 'path';
import * as fs from 'fs';
import { getContentType, openFileWithDefaultProgram, parseUrlParams } from 'utils';

const PDF_HTML_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
    <title>PDF Viewer</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf_viewer.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
    <style>
        #toolbar {
            background-color: #474747;
            padding: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        #toolbar button {
            padding: 5px 10px;
            cursor: pointer;
        }
        #pageNumber {
            width: 50px;
        }
        #viewerContainer {
            overflow: auto;
            position: absolute;
            width: 100%;
            top: 50px;
            bottom: 0;
        }
        #viewer {
            position: relative;
            margin: 0 auto;
        }
        #viewer canvas {
            margin: 10px auto;
            display: block;
        }
    </style>
</head>
<body>
    <div id="toolbar">
        <button id="prev">Previous</button>
        <button id="next">Next</button>
        <span>Page: <input type="number" id="pageNumber" value="1"> / <span id="pageCount">0</span></span>
        <button id="zoomOut">-</button>
        <button id="zoomIn">+</button>
    </div>
    <div id="viewerContainer">
        <div id="viewer"></div>
    </div>
    <script>
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        
        let pdfDoc = null;
        let pageNum = PAGE_TO_REPLACE;
        let scale = 1.5;
        const viewer = document.getElementById('viewer');
        const pageNumberInput = document.getElementById('pageNumber');
        const pageCount = document.getElementById('pageCount');

        async function loadPDF(url) {
            try {
                pdfDoc = await pdfjsLib.getDocument(url).promise;
                pageCount.textContent = pdfDoc.numPages;
                renderPage(pageNum);
            } catch (error) {
                console.error('Error loading PDF:', error);
            }
        }

        async function renderPage(num) {
            const page = await pdfDoc.getPage(num);
            const viewport = page.getViewport({ scale });
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            viewer.innerHTML = '';
            viewer.appendChild(canvas);
            
            await page.render(renderContext).promise;
            pageNumberInput.value = num;
        }

        document.getElementById('prev').addEventListener('click', () => {
            if (pageNum <= 1) return;
            pageNum--;
            renderPage(pageNum);
        });

        document.getElementById('next').addEventListener('click', () => {
            if (pageNum >= pdfDoc.numPages) return;
            pageNum++;
            renderPage(pageNum);
        });

        document.getElementById('zoomIn').addEventListener('click', () => {
            scale *= 1.2;
            renderPage(pageNum);
        });

        document.getElementById('zoomOut').addEventListener('click', () => {
            scale *= 0.8;
            renderPage(pageNum);
        });

        pageNumberInput.addEventListener('change', () => {
            const n = parseInt(pageNumberInput.value);
            if (n > 0 && n <= pdfDoc.numPages) {
                pageNum = n;
                renderPage(pageNum);
            }
        });

        loadPDF('URL_TO_REPLACE');
    </script>
</body>
</html>`


const UNSUPPORTED_FILE_TEMPLATE = `
<html>
<body>
	<p>Unsupported file type.</p>
	<a href="URL_TO_REPLACE">FILENAME_TO_REPLACE</a>
</body>
</html>
`


export function getTemplate(extname: string) {
	extname = extname.toLowerCase();
	const _map: { [key: string]: string } = {
		'.pdf': PDF_HTML_TEMPLATE,
	};
	if (_map[extname]) {
		return _map[extname];
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



function getFilePathFromUrl(url: string, homeDirectory: string, vaultDirectory: string) {
	// console.log("getFilePathFromUrl", url);
	const [urlWithoutParams, params] = url.split('?');
	const parsedParams = parseUrlParams(params);
	// console.log("urlWithoutParams", urlWithoutParams);
	// console.log("parsedParams", parsedParams);
	if(urlWithoutParams.startsWith("/download/home") || urlWithoutParams.startsWith("/open/home") || urlWithoutParams.startsWith("/embed/home")) {
		const decodedPath = decodeURIComponent(parsedParams.p);
		const filePath = path.join(homeDirectory, decodedPath);
		return filePath;
	} else if(urlWithoutParams.startsWith("/download/vault") || urlWithoutParams.startsWith("/open/vault") || urlWithoutParams.startsWith("/embed/vault")) {
		const decodedPath = decodeURIComponent(parsedParams.p);
		const filePath = path.join(vaultDirectory, decodedPath);
		return filePath;
	}
	throw new Error("Invalid url: " + url);
}
export function embedRequestHandler(url: string, req: http.IncomingMessage, res: http.ServerResponse, homeDirectory: string, vaultDirectory: string) {
	res.setHeader('Content-Type', 'text/html; charset=utf-8');
	// url may contain ? followed by parameters, split url and parameters
	const [, params] = url.split('?');
	const parsedParams = parseUrlParams(params);
	const extname = path.extname(parsedParams.p).toLowerCase();
	const template = getTemplate(extname);
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
		}
		res.end(multiLineStr);
	} else {
		const openUrl = url.replace("/embed/", "/open/");
		const multiLineStr = UNSUPPORTED_FILE_TEMPLATE.replace("URL_TO_REPLACE", openUrl).replace("FILENAME_TO_REPLACE", path.basename(url));
		res.end(multiLineStr);
	}
}
export function downloadRequestHandler(url: string, req: http.IncomingMessage, res: http.ServerResponse, homeDirectory: string, vaultDirectory: string) {
	const filePath = getFilePathFromUrl(url, homeDirectory, vaultDirectory);
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
function openRequestHandler(url: string, req: http.IncomingMessage, res: http.ServerResponse, homeDirectory: string, vaultDirectory: string) {
	const filePath = getFilePathFromUrl(url, homeDirectory, vaultDirectory);
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
export function httpRequestHandler(req: http.IncomingMessage, res: http.ServerResponse, homeDirectory: string, vaultDirectory: string) {
	// console.log("httpRequestHandler", req.url);
	// Read file content and return it via http response
	const url = req.url;
	if(!url) {
		res.writeHead(404);
		res.end("Invalid path");
		return;
	}
	if(url.startsWith("/embed/")) {
		embedRequestHandler(url, req, res, homeDirectory, vaultDirectory);
		return;
	}else if(url.startsWith("/download/")) {
		downloadRequestHandler(url, req, res, homeDirectory, vaultDirectory);
		return;
	}else if(url.startsWith("/open/")) {
		openRequestHandler(url, req, res, homeDirectory, vaultDirectory);
		return;
	}
	res.writeHead(404);
	res.end(`Invalid path ${url}`);

}

