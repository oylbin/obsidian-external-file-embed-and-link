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

        // Reading-mode normalization for `.LinkRelativeTo` anchors: rewrite the
        // visible text to the resolved file's basename. Click handling is NOT
        // bound here — a single document-level delegated handler in main.ts
        // takes care of clicks for both Reading mode and Live Preview, so the
        // resolution + open logic lives in exactly one place
        // (`handleInlineLinkClick` below).
        element.querySelectorAll('.LinkRelativeTo').forEach((el) => {
            try {
                const fullPath = this.resolveInlineLinkHref(el as HTMLAnchorElement);
                el.textContent = path.basename(fullPath);
            } catch (_error) {
                // Leave the original text in place when resolution fails. The
                // delegated click handler will surface the error as a Notice
                // when the user actually clicks the link.
            }
        });
    }

    /**
     * Handle a click on an `.LinkRelativeTo` anchor. Resolves the virtual
     * directory href, validates the target exists, and opens it with the
     * system default program. Any failure surfaces as an Obsidian Notice.
     *
     * Invoked from the document-level delegated click handler in main.ts so
     * that both Reading mode and Live Preview share the exact same behavior.
     */
    public handleInlineLinkClick(anchor: HTMLAnchorElement): void {
        try {
            const fullPath = this.resolveInlineLinkHref(anchor);
            openFileWithDefaultProgram(fullPath, (error) => {
                if (error) {
                    new Notice("Failed to open file: " + error.message);
                }
            });
        } catch (error) {
            new Notice(`Inline link error: ${(error as Error).message}`);
        }
    }

    /**
     * Parse an `.LinkRelativeTo` anchor's `href` (form: `#dirId://relPath`),
     * resolve the virtual directory, and return the absolute path on disk.
     * Throws with a descriptive message if any step fails — callers are
     * expected to surface the error appropriately (Notice / silent skip).
     */
    private resolveInlineLinkHref(anchor: HTMLAnchorElement): string {
        const url0 = anchor.getAttribute('href');
        if (!url0) {
            throw new Error(`href is not set for link "${anchor.textContent}"`);
        }
        const url = url0.substring(1);
        const directoryId = url.split(':')[0];
        if (!directoryId) {
            throw new Error(`Failed to extract directoryId from href "${url0}" for link "${anchor.textContent}"`);
        }
        const relativePath = url.split(':')[1];
        if (!relativePath) {
            throw new Error(`Failed to extract relativePath from href "${url0}" for link "${anchor.textContent}"`);
        }
        const directoryPath = this.directoryConfigManager.getLocalDirectory(directoryId);
        if (!directoryPath) {
            throw new Error(`Virtual directory "${directoryId}" not found for link "${anchor.textContent}"`);
        }
        const fullPath = path.join(directoryPath, relativePath);
        if (!existsSync(fullPath)) {
            throw new Error(`Virtual file url "${url0}" is resolved to non-existent file "${fullPath}" for link "${anchor.textContent}"`);
        }
        return fullPath;
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
