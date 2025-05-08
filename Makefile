dev:
	npm run dev

build:
	npm run build

clean:
	npm run clean

install:
	mkdir -p ~/SynologyDrive/AppDataSync/obsidian/.obsidian/plugins/external-file-embed-and-link
	cp main.js ~/SynologyDrive/AppDataSync/obsidian/.obsidian/plugins/external-file-embed-and-link
	cp styles.css ~/SynologyDrive/AppDataSync/obsidian/.obsidian/plugins/external-file-embed-and-link
	cp manifest.json ~/SynologyDrive/AppDataSync/obsidian/.obsidian/plugins/external-file-embed-and-link

download:
	curl -o manifest.json -L https://github.com/oylbin/obsidian-external-file-embed-and-link/releases/latest/download/manifest.json
	curl -o styles.css -L https://github.com/oylbin/obsidian-external-file-embed-and-link/releases/latest/download/styles.css
	curl -o main.js -L https://github.com/oylbin/obsidian-external-file-embed-and-link/releases/latest/download/main.js
