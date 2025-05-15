import * as http from 'http';

export async function InlineAssetHandler(url: string, req: http.IncomingMessage, res: http.ServerResponse) {
	console.log("InlineAssetHandler", url);
	

	if(url === "/assets/pdfjs-5.2.133-dist/build/pdf.mjs") {
		res.setHeader('Content-Type', 'text/javascript');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/build/pdf.mjs');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/build/pdf.sandbox.mjs") {
		res.setHeader('Content-Type', 'text/javascript');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/build/pdf.sandbox.mjs');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/build/pdf.worker.mjs") {
		res.setHeader('Content-Type', 'text/javascript');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/build/pdf.worker.mjs');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/debugger.css") {
		res.setHeader('Content-Type', 'text/css');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/debugger.css');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/debugger.mjs") {
		res.setHeader('Content-Type', 'text/javascript');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/debugger.mjs');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/viewer.css") {
		res.setHeader('Content-Type', 'text/css');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/viewer.css');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/viewer.html") {
		res.setHeader('Content-Type', 'text/html');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/viewer.html');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/viewer.mjs") {
		res.setHeader('Content-Type', 'text/javascript');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/viewer.mjs');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/iccs/CGATS001Compat-v2-micro.icc") {
		res.setHeader('Content-Type', 'application/vnd.iccprofile');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/iccs/CGATS001Compat-v2-micro.icc');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/altText_add.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/altText_add.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/altText_disclaimer.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/altText_disclaimer.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/altText_done.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/altText_done.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/altText_spinner.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/altText_spinner.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/altText_warning.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/altText_warning.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/annotation-check.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/annotation-check.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/annotation-comment.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/annotation-comment.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/annotation-help.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/annotation-help.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/annotation-insert.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/annotation-insert.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/annotation-key.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/annotation-key.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/annotation-newparagraph.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/annotation-newparagraph.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/annotation-noicon.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/annotation-noicon.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/annotation-note.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/annotation-note.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/annotation-paperclip.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/annotation-paperclip.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/annotation-paragraph.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/annotation-paragraph.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/annotation-pushpin.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/annotation-pushpin.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/cursor-editorFreeHighlight.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/cursor-editorFreeHighlight.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/cursor-editorFreeText.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/cursor-editorFreeText.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/cursor-editorInk.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/cursor-editorInk.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/cursor-editorTextHighlight.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/cursor-editorTextHighlight.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/editor-toolbar-delete.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/editor-toolbar-delete.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/editor-toolbar-edit.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/editor-toolbar-edit.svg');
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

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/gv-toolbarButton-download.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/gv-toolbarButton-download.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/loading-icon.gif") {
		res.setHeader('Content-Type', 'image/gif');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/loading-icon.gif');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/loading.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/loading.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/messageBar_closingButton.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/messageBar_closingButton.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/messageBar_info.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/messageBar_info.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/messageBar_warning.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/messageBar_warning.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-documentProperties.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-documentProperties.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-firstPage.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-firstPage.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-handTool.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-handTool.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-lastPage.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-lastPage.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-rotateCcw.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-rotateCcw.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-rotateCw.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-rotateCw.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-scrollHorizontal.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-scrollHorizontal.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-scrollPage.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-scrollPage.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-scrollVertical.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-scrollVertical.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-scrollWrapped.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-scrollWrapped.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-selectTool.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-selectTool.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-spreadEven.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-spreadEven.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-spreadNone.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-spreadNone.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-spreadOdd.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/secondaryToolbarButton-spreadOdd.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-bookmark.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-bookmark.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-currentOutlineItem.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-currentOutlineItem.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-download.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-download.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-editorFreeText.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-editorFreeText.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-editorHighlight.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-editorHighlight.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-editorInk.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-editorInk.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-editorSignature.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-editorSignature.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-editorStamp.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-editorStamp.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-menuArrow.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-menuArrow.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-openFile.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-openFile.svg');
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

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-presentationMode.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-presentationMode.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-print.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-print.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-search.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-search.svg');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/images/toolbarButton-secondaryToolbarToggle.svg") {
		res.setHeader('Content-Type', 'image/svg+xml');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/images/toolbarButton-secondaryToolbarToggle.svg');
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

	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/locale.json") {
		res.setHeader('Content-Type', 'application/json');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/locale.json');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/standard_fonts/FoxitDingbats.pfb") {
		res.setHeader('Content-Type', 'application/x-font-pfb');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/standard_fonts/FoxitDingbats.pfb');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/standard_fonts/FoxitFixed.pfb") {
		res.setHeader('Content-Type', 'application/x-font-pfb');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/standard_fonts/FoxitFixed.pfb');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/standard_fonts/FoxitFixedBold.pfb") {
		res.setHeader('Content-Type', 'application/x-font-pfb');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/standard_fonts/FoxitFixedBold.pfb');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/standard_fonts/FoxitFixedBoldItalic.pfb") {
		res.setHeader('Content-Type', 'application/x-font-pfb');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/standard_fonts/FoxitFixedBoldItalic.pfb');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/standard_fonts/FoxitFixedItalic.pfb") {
		res.setHeader('Content-Type', 'application/x-font-pfb');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/standard_fonts/FoxitFixedItalic.pfb');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/standard_fonts/FoxitSerif.pfb") {
		res.setHeader('Content-Type', 'application/x-font-pfb');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/standard_fonts/FoxitSerif.pfb');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/standard_fonts/FoxitSerifBold.pfb") {
		res.setHeader('Content-Type', 'application/x-font-pfb');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/standard_fonts/FoxitSerifBold.pfb');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/standard_fonts/FoxitSerifBoldItalic.pfb") {
		res.setHeader('Content-Type', 'application/x-font-pfb');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/standard_fonts/FoxitSerifBoldItalic.pfb');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/standard_fonts/FoxitSerifItalic.pfb") {
		res.setHeader('Content-Type', 'application/x-font-pfb');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/standard_fonts/FoxitSerifItalic.pfb');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/standard_fonts/FoxitSymbol.pfb") {
		res.setHeader('Content-Type', 'application/x-font-pfb');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/standard_fonts/FoxitSymbol.pfb');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/standard_fonts/LiberationSans-Bold.ttf") {
		res.setHeader('Content-Type', 'font/ttf');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/standard_fonts/LiberationSans-Bold.ttf');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/standard_fonts/LiberationSans-BoldItalic.ttf") {
		res.setHeader('Content-Type', 'font/ttf');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/standard_fonts/LiberationSans-BoldItalic.ttf');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/standard_fonts/LiberationSans-Italic.ttf") {
		res.setHeader('Content-Type', 'font/ttf');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/standard_fonts/LiberationSans-Italic.ttf');
		res.end(content.default);
		return;
	}

	if(url === "/assets/pdfjs-5.2.133-dist/web/standard_fonts/LiberationSans-Regular.ttf") {
		res.setHeader('Content-Type', 'font/ttf');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/standard_fonts/LiberationSans-Regular.ttf');
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