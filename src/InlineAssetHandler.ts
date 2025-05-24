import * as http from 'http';

export async function InlineAssetHandler(url: string, req: http.IncomingMessage, res: http.ServerResponse) {
	// console.log("InlineAssetHandler", url);
	

	if(url === "/assets/pdfjs-5.2.133-dist/build/pdf.mjs") {
		res.setHeader('Content-Type', 'text/javascript');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/build/pdf.mjs');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/build/pdf.worker.mjs") {
		res.setHeader('Content-Type', 'text/javascript');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/build/pdf.worker.mjs');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/viewer.css") {
		res.setHeader('Content-Type', 'text/css');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/viewer.css');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/viewer.mjs") {
		res.setHeader('Content-Type', 'text/javascript');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/viewer.mjs');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/annotation-noicon.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/annotation-noicon.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/findbarButton-next.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/findbarButton-next.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/findbarButton-previous.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/findbarButton-previous.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/loading.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/loading.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/loading-icon.gif") {
		res.setHeader('Content-Type', 'image/gif');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/loading-icon.gif');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-currentOutlineItem.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-currentOutlineItem.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-menuArrow.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-menuArrow.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-pageDown.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-pageDown.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-pageUp.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-pageUp.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-search.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-search.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-sidebarToggle.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-sidebarToggle.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-viewAttachments.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-viewAttachments.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-viewLayers.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-viewLayers.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-viewOutline.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-viewOutline.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-viewThumbnail.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-viewThumbnail.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-zoomIn.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-zoomIn.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-zoomOut.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-zoomOut.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/treeitem-collapsed.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/treeitem-collapsed.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/treeitem-expanded.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/treeitem-expanded.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-openFile.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-openFile.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/wasm/openjpeg.wasm") {
		res.setHeader('Content-Type', 'application/wasm');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/wasm/openjpeg.wasm');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/wasm/openjpeg_nowasm_fallback.js") {
		res.setHeader('Content-Type', 'text/javascript');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/wasm/openjpeg_nowasm_fallback.js');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/wasm/qcms_bg.wasm") {
		res.setHeader('Content-Type', 'application/wasm');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/wasm/qcms_bg.wasm');
		res.end(content.default);
		return;
	}

	res.writeHead(404);
	res.end(`Invalid path ${url}`);
	console.log("Invalid path", url);
}