import { App, Modal } from 'obsidian';

export class DirectorySelectionModal extends Modal {
    private selectedDirectoryId: string | null = null;
    private resolvePromise: ((value: string | null) => void) | null = null;

    constructor(
        app: App,
        private directories: Record<string, string>
    ) {
        super(app);
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();

        // Add title
        contentEl.createEl('h2', {
            text: 'Which virtual directory to use for the link',
            cls: 'external-embed-modal-title'
        });

        // Create container for directory buttons with vertical layout
        const buttonContainer = contentEl.createDiv('directory-buttons-container');
        
        // Add a button for each directory
        Object.entries(this.directories).forEach(([id, path]) => {
            const button = buttonContainer.createEl('button', {
                text: `${id} (${path})`,
                cls: 'external-embed-directory-button'
            });
            
            button.addEventListener('click', () => {
                this.selectedDirectoryId = id;
                this.close();
            });
        });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
        if (this.resolvePromise) {
            this.resolvePromise(this.selectedDirectoryId);
        }
    }

    async waitForSelection(): Promise<string | null> {
        return new Promise((resolve) => {
            this.resolvePromise = resolve;
        });
    }
} 
