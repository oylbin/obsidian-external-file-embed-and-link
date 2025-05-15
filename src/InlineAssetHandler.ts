import * as http from 'http';

export async function InlineAssetHandler(url: string, req: http.IncomingMessage, res: http.ServerResponse) {
	console.log("InlineAssetHandler", url);
	

	if(url === "/assets/pdfjs-5.2.133-dist/build/pdf.mjs") {
		res.setHeader('Content-Type', 'text/javascript');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/build/pdf.mjs');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/build/pdf.mjs.map") {
		res.setHeader('Content-Type', 'application/json');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/build/pdf.mjs.map');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/build/pdf.sandbox.mjs") {
		res.setHeader('Content-Type', 'text/javascript');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/build/pdf.sandbox.mjs');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/build/pdf.sandbox.mjs.map") {
		res.setHeader('Content-Type', 'application/json');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/build/pdf.sandbox.mjs.map');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/build/pdf.worker.mjs") {
		res.setHeader('Content-Type', 'text/javascript');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/build/pdf.worker.mjs');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/build/pdf.worker.mjs.map") {
		res.setHeader('Content-Type', 'application/json');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/build/pdf.worker.mjs.map');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/78-EUC-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/78-EUC-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/78-EUC-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/78-EUC-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/78-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/78-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/78-RKSJ-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/78-RKSJ-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/78-RKSJ-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/78-RKSJ-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/78-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/78-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/78ms-RKSJ-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/78ms-RKSJ-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/78ms-RKSJ-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/78ms-RKSJ-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/83pv-RKSJ-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/83pv-RKSJ-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/90ms-RKSJ-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/90ms-RKSJ-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/90ms-RKSJ-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/90ms-RKSJ-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/90msp-RKSJ-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/90msp-RKSJ-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/90msp-RKSJ-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/90msp-RKSJ-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/90pv-RKSJ-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/90pv-RKSJ-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/90pv-RKSJ-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/90pv-RKSJ-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Add-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Add-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Add-RKSJ-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Add-RKSJ-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Add-RKSJ-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Add-RKSJ-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Add-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Add-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-CNS1-0.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-CNS1-0.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-CNS1-1.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-CNS1-1.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-CNS1-2.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-CNS1-2.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-CNS1-3.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-CNS1-3.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-CNS1-4.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-CNS1-4.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-CNS1-5.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-CNS1-5.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-CNS1-6.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-CNS1-6.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-CNS1-UCS2.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-CNS1-UCS2.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-GB1-0.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-GB1-0.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-GB1-1.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-GB1-1.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-GB1-2.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-GB1-2.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-GB1-3.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-GB1-3.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-GB1-4.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-GB1-4.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-GB1-5.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-GB1-5.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-GB1-UCS2.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-GB1-UCS2.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-Japan1-0.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-Japan1-0.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-Japan1-1.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-Japan1-1.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-Japan1-2.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-Japan1-2.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-Japan1-3.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-Japan1-3.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-Japan1-4.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-Japan1-4.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-Japan1-5.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-Japan1-5.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-Japan1-6.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-Japan1-6.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-Japan1-UCS2.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-Japan1-UCS2.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-Korea1-0.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-Korea1-0.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-Korea1-1.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-Korea1-1.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-Korea1-2.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-Korea1-2.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-Korea1-UCS2.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Adobe-Korea1-UCS2.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/B5-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/B5-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/B5-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/B5-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/B5pc-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/B5pc-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/B5pc-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/B5pc-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/CNS-EUC-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/CNS-EUC-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/CNS-EUC-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/CNS-EUC-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/CNS1-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/CNS1-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/CNS1-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/CNS1-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/CNS2-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/CNS2-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/CNS2-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/CNS2-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/ETen-B5-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/ETen-B5-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/ETen-B5-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/ETen-B5-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/ETenms-B5-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/ETenms-B5-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/ETenms-B5-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/ETenms-B5-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/ETHK-B5-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/ETHK-B5-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/ETHK-B5-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/ETHK-B5-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/EUC-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/EUC-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/EUC-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/EUC-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Ext-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Ext-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Ext-RKSJ-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Ext-RKSJ-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Ext-RKSJ-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Ext-RKSJ-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Ext-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Ext-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/GB-EUC-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/GB-EUC-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/GB-EUC-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/GB-EUC-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/GB-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/GB-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/GB-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/GB-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/GBK-EUC-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/GBK-EUC-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/GBK-EUC-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/GBK-EUC-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/GBK2K-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/GBK2K-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/GBK2K-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/GBK2K-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/GBKp-EUC-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/GBKp-EUC-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/GBKp-EUC-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/GBKp-EUC-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/GBpc-EUC-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/GBpc-EUC-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/GBpc-EUC-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/GBpc-EUC-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/GBT-EUC-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/GBT-EUC-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/GBT-EUC-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/GBT-EUC-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/GBT-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/GBT-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/GBT-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/GBT-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/GBTpc-EUC-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/GBTpc-EUC-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/GBTpc-EUC-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/GBTpc-EUC-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Hankaku.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Hankaku.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Hiragana.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Hiragana.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/HKdla-B5-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/HKdla-B5-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/HKdla-B5-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/HKdla-B5-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/HKdlb-B5-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/HKdlb-B5-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/HKdlb-B5-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/HKdlb-B5-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/HKgccs-B5-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/HKgccs-B5-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/HKgccs-B5-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/HKgccs-B5-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/HKm314-B5-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/HKm314-B5-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/HKm314-B5-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/HKm314-B5-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/HKm471-B5-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/HKm471-B5-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/HKm471-B5-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/HKm471-B5-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/HKscs-B5-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/HKscs-B5-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/HKscs-B5-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/HKscs-B5-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Katakana.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Katakana.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/KSC-EUC-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/KSC-EUC-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/KSC-EUC-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/KSC-EUC-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/KSC-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/KSC-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/KSC-Johab-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/KSC-Johab-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/KSC-Johab-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/KSC-Johab-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/KSC-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/KSC-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/KSCms-UHC-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/KSCms-UHC-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/KSCms-UHC-HW-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/KSCms-UHC-HW-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/KSCms-UHC-HW-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/KSCms-UHC-HW-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/KSCms-UHC-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/KSCms-UHC-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/KSCpc-EUC-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/KSCpc-EUC-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/KSCpc-EUC-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/KSCpc-EUC-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/NWP-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/NWP-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/NWP-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/NWP-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/RKSJ-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/RKSJ-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/RKSJ-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/RKSJ-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/Roman.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/Roman.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniCNS-UCS2-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniCNS-UCS2-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniCNS-UCS2-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniCNS-UCS2-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniCNS-UTF16-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniCNS-UTF16-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniCNS-UTF16-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniCNS-UTF16-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniCNS-UTF32-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniCNS-UTF32-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniCNS-UTF32-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniCNS-UTF32-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniCNS-UTF8-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniCNS-UTF8-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniCNS-UTF8-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniCNS-UTF8-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniGB-UCS2-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniGB-UCS2-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniGB-UCS2-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniGB-UCS2-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniGB-UTF16-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniGB-UTF16-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniGB-UTF16-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniGB-UTF16-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniGB-UTF32-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniGB-UTF32-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniGB-UTF32-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniGB-UTF32-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniGB-UTF8-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniGB-UTF8-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniGB-UTF8-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniGB-UTF8-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS-UCS2-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS-UCS2-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS-UCS2-HW-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS-UCS2-HW-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS-UCS2-HW-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS-UCS2-HW-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS-UCS2-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS-UCS2-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS-UTF16-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS-UTF16-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS-UTF16-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS-UTF16-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS-UTF32-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS-UTF32-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS-UTF32-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS-UTF32-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS-UTF8-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS-UTF8-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS-UTF8-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS-UTF8-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS2004-UTF16-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS2004-UTF16-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS2004-UTF16-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS2004-UTF16-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS2004-UTF32-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS2004-UTF32-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS2004-UTF32-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS2004-UTF32-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS2004-UTF8-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS2004-UTF8-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS2004-UTF8-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniJIS2004-UTF8-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniJISPro-UCS2-HW-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniJISPro-UCS2-HW-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniJISPro-UCS2-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniJISPro-UCS2-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniJISPro-UTF8-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniJISPro-UTF8-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniJISX0213-UTF32-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniJISX0213-UTF32-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniJISX0213-UTF32-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniJISX0213-UTF32-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniJISX02132004-UTF32-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniJISX02132004-UTF32-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniJISX02132004-UTF32-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniJISX02132004-UTF32-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniKS-UCS2-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniKS-UCS2-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniKS-UCS2-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniKS-UCS2-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniKS-UTF16-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniKS-UTF16-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniKS-UTF16-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniKS-UTF16-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniKS-UTF32-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniKS-UTF32-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniKS-UTF32-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniKS-UTF32-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniKS-UTF8-H.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniKS-UTF8-H.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/UniKS-UTF8-V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/UniKS-UTF8-V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/V.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/V.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/cmaps/WP-Symbol.bcmap") {
		res.setHeader('Content-Type', 'application/octet-stream');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/cmaps/WP-Symbol.bcmap');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/compressed.tracemonkey-pldi-09.pdf") {
		res.setHeader('Content-Type', 'application/pdf');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/compressed.tracemonkey-pldi-09.pdf');
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
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/ach/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/ach/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/af/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/af/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/an/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/an/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/ar/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/ar/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/ast/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/ast/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/az/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/az/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/be/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/be/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/bg/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/bg/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/bn/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/bn/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/bo/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/bo/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/br/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/br/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/brx/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/brx/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/bs/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/bs/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/ca/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/ca/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/cak/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/cak/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/ckb/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/ckb/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/cs/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/cs/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/cy/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/cy/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/da/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/da/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/de/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/de/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/dsb/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/dsb/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/el/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/el/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/en-CA/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/en-CA/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/en-GB/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/en-GB/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/en-US/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/en-US/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/eo/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/eo/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/es-AR/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/es-AR/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/es-CL/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/es-CL/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/es-ES/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/es-ES/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/es-MX/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/es-MX/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/et/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/et/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/eu/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/eu/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/fa/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/fa/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/ff/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/ff/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/fi/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/fi/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/fr/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/fr/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/fur/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/fur/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/fy-NL/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/fy-NL/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/ga-IE/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/ga-IE/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/gd/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/gd/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/gl/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/gl/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/gn/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/gn/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/gu-IN/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/gu-IN/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/he/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/he/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/hi-IN/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/hi-IN/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/hr/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/hr/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/hsb/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/hsb/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/hu/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/hu/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/hy-AM/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/hy-AM/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/hye/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/hye/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/ia/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/ia/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/id/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/id/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/is/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/is/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/it/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/it/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/ja/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/ja/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/ka/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/ka/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/kab/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/kab/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/kk/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/kk/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/km/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/km/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/kn/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/kn/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/ko/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/ko/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/lij/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/lij/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/lo/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/lo/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/locale.json") {
		res.setHeader('Content-Type', 'application/json');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/locale.json');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/lt/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/lt/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/ltg/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/ltg/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/lv/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/lv/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/meh/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/meh/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/mk/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/mk/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/ml/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/ml/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/mr/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/mr/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/ms/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/ms/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/my/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/my/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/nb-NO/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/nb-NO/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/ne-NP/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/ne-NP/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/nl/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/nl/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/nn-NO/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/nn-NO/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/oc/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/oc/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/pa-IN/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/pa-IN/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/pl/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/pl/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/pt-BR/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/pt-BR/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/pt-PT/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/pt-PT/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/rm/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/rm/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/ro/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/ro/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/ru/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/ru/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/sat/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/sat/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/sc/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/sc/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/scn/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/scn/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/sco/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/sco/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/si/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/si/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/sk/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/sk/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/skr/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/skr/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/sl/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/sl/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/son/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/son/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/sq/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/sq/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/sr/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/sr/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/sv-SE/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/sv-SE/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/szl/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/szl/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/ta/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/ta/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/te/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/te/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/tg/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/tg/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/th/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/th/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/tl/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/tl/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/tr/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/tr/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/trs/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/trs/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/uk/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/uk/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/ur/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/ur/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/uz/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/uz/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/vi/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/vi/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/wo/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/wo/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/xh/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/xh/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/zh-CN/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/zh-CN/viewer.ftl');
		res.end(content.default);
		return;
	}
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/locale/zh-TW/viewer.ftl") {
		res.setHeader('Content-Type', 'text/plain');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/locale/zh-TW/viewer.ftl');
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
	
	
	if(url === "/assets/pdfjs-5.2.133-dist/web/viewer.mjs.map") {
		res.setHeader('Content-Type', 'application/json');
		const content = await import('inline:./assets/pdfjs-5.2.133-dist/web/viewer.mjs.map');
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