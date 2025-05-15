# iterate list.txt and print each line

codeLines = """
if(url === "{url}") {{
	res.setHeader('Content-Type', '{contentType}');
	const content = await import('inline:.{url}');
	res.end(content.default);
    return;
}}
"""

contentTypeDict = {
    "bcmap": "application/octet-stream",
    "css": "text/css",
    # FreeMarker Template Language files are typically processed server-side. The Content-Type will depend on the output they generate (e.g., text/html, application/json). text/plain is a fallback if serving the template file itself.
    "ftl": "text/plain",
    "gif": "image/gif",
    "html": "text/html",
    "icc": "application/vnd.iccprofile",  # Also seen as .icm
    "js": "text/javascript",  # application/javascript is also valid
    "json": "application/json",
    # Source maps are often .json. For generic binary map files, application/octet-stream might be used.
    "map": "application/json",
    "mjs": "text/javascript",  # For JavaScript modules application/javascript is also valid
    "pdf": "application/pdf",
    # Printer Font Binary, specific for Adobe Type 1 fonts. application/octet-stream or application/x-font can also be encountered.
    "pfb": "application/x-font-pfb",
    "svg": "image/svg+xml",
    "ttf": "font/ttf",  # application/font-sfnt or application/x-font-ttf are also seen.
    "wasm": "application/wasm"
}


with open('list.txt', 'r') as file:
    for line in file:
        url = line.strip()[3:]
        ext = url.split('.')[-1]
        contentType = contentTypeDict[ext]
        print(codeLines.format(url=url, contentType=contentType))
