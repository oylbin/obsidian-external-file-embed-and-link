import os
import jinja2

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


urls = []
# iterate all files recursively in src/assets/pdfjs-5.2.133-dist/
for root, dirs, files in os.walk('src/assets/pdfjs-5.2.133-dist/'):
    for file in files:
        url = os.path.join(root, file)
        # change sep to /
        url = url.replace('\\', '/')
        ext = url.split('.')[-1]
        if ext in ['map', 'pdf', 'bcmap', 'ftl']:
            continue
        filename = os.path.basename(url)
        if 'LICENSE' in filename:
            continue
        contentType = contentTypeDict.get(ext, "application/octet-stream")
        fileSize = os.path.getsize(url)
        print(f"{fileSize:,} bytes, {url}, {contentType}")
        # remove first 3 characters
        urls.append((url[3:], contentType))

# write urls to src/InlineAssetHandler.ts
with open('src/InlineAssetHandler.ts', 'w') as file:
    file.write(jinja2.Template(open('src/templates/InlineAssetHandler.ts.jinja2').read()).render(urls=urls))
