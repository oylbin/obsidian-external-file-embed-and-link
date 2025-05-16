import { MarkdownPostProcessorContext } from 'obsidian';
import * as path from 'path';
import { openFileWithDefaultProgram } from './utils';
import { Notice } from 'obsidian';
import { existsSync } from 'fs';

export class LinkProcessor {
    constructor(
        private homeDirectory: string,
        private vaultDirectory: string,
        private directoryConfigManager: any
    ) {}

    public processInlineLink(element: HTMLElement, context: MarkdownPostProcessorContext) {
        element.querySelectorAll('.LinkRelativeToHome').forEach((el) => {
            const relativePath = el.textContent?.trim();
            const fullPath = this.homeDirectory + "/" + relativePath;
            el.textContent = path.basename(fullPath);

            el.addEventListener("click", () => {
                openFileWithDefaultProgram(fullPath, (error) => {
                    if (error) {
                        new Notice("Failed to open file: " + error.message);
                    }
                });
            });
        });

        element.querySelectorAll('.LinkRelativeToVault').forEach((el) => {
            const relativePath = el.textContent?.trim();
            const fullPath = this.vaultDirectory + "/" + relativePath;
            el.textContent = path.basename(fullPath);

            el.addEventListener("click", () => {
                openFileWithDefaultProgram(fullPath, (error) => {
                    if (error) {
                        new Notice("Failed to open file: " + error.message);
                    }
                });
            });
        });

        element.querySelectorAll('.LinkRelativeTo').forEach((el) => {
            try {
                const url0 = el.getAttribute('href');
                if (!url0) {
                    throw new Error(`href is not set for link "${el.textContent}"`);
                }
                const url = url0.substring(1);
                const directoryId = url.split(':')[0];
                if (!directoryId) {
                    throw new Error(`Failed to extract directoryId from href "${url0}" for link "${el.textContent}"`);
                }
                const relativePath = url.split(':')[1];
                if (!relativePath) {
                    throw new Error(`Failed to extract relativePath from href "${url0}" for link "${el.textContent}"`);
                }
                const directoryPath = this.directoryConfigManager.getLocalDirectory(directoryId);
                if (!directoryPath) {
                    throw new Error(`Virtual directory "${directoryId}" not found for link "${el.textContent}"`);
                }
                const fullPath = path.join(directoryPath, relativePath);
                if(!existsSync(fullPath)) {
                    throw new Error(`Virtual file url "${url0}" is resolved to non-existent file "${fullPath}" for link "${el.textContent}"`);
                }
                el.textContent = path.basename(fullPath);
                el.addEventListener("click", () => {
                    openFileWithDefaultProgram(fullPath, (error) => {
                        if (error) {
                            new Notice("Failed to open file: " + error.message);
                        }
                    });
                });
            } catch(error) {
                el.addEventListener("click", () => {
                    new Notice(`Inline link error: ${error.message}`);
                });
            }
        });
    }

    public processCodeBlockLink(relativeTo: "home" | "vault", source: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
        let filePath = source.trim();
        if (filePath.startsWith("/")) {
            filePath = filePath.substring(1);
        }
        const fullPath = `${relativeTo === "home" ? this.homeDirectory : this.vaultDirectory}/${filePath}`;
        const fileName = filePath.split("/").pop();

        const link = document.createElement("a");
        link.href = "#";
        link.textContent = fileName ?? "Unknown file";

        link.addEventListener("click", () => {
            openFileWithDefaultProgram(fullPath, (error) => {
                if (error) {
                    new Notice("Failed to open file: " + error.message);
                }
            });
        });

        element.appendChild(link);
    }
} 
