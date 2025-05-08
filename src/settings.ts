import CrossComputerLinkPlugin from 'main';
import { App, Platform, PluginSettingTab, Setting, TextComponent, ButtonComponent } from 'obsidian';

export enum DragAction {
    Default = 'default',
    LinkRelativeToHome = 'LinkRelativeToHome',
    LinkRelativeToVault = 'LinkRelativeToVault',
    EmbedRelativeToHome = 'EmbedRelativeToHome',
    EmbedRelativeToVault = 'EmbedRelativeToVault',
    InlineLinkRelativeToHome = 'InlineLinkRelativeToHome',
    InlineLinkRelativeToVault = 'InlineLinkRelativeToVault'
}

export interface CustomDirectoryConfig {
    id: string;
    directory: string;
    sync: boolean;
}

export interface CrossComputerLinkPluginSettings {
    dragWithCtrl: DragAction;
    dragWithShift: DragAction;
    dragWithCtrlShift: DragAction;
    enableDragAndDrop: boolean;
    customDirectories: CustomDirectoryConfig[];
}

export const DEFAULT_SETTINGS: CrossComputerLinkPluginSettings = {
    dragWithCtrl: DragAction.Default,
    dragWithShift: DragAction.InlineLinkRelativeToHome,
    dragWithCtrlShift: DragAction.EmbedRelativeToHome,
    enableDragAndDrop: true,
    customDirectories: []
}

export class CrossComputerLinkSettingTab extends PluginSettingTab {
    plugin: CrossComputerLinkPlugin;

    constructor(app: App, plugin: CrossComputerLinkPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        // Add drag and drop settings section
        containerEl.createEl('h2', { text: 'Drag and Drop Settings' });
        
        const createSetting = (name: string, desc: string, value: string, onchangeFn: (value: string) => void) => {
            new Setting(containerEl)
                .setName(name)
                .setDesc(desc)
                .addDropdown(dropdown => dropdown
                    .addOption(DragAction.Default, 'Obsidian default action')
                    .addOption(DragAction.LinkRelativeToHome, 'LinkRelativeToHome')
                    .addOption(DragAction.LinkRelativeToVault, 'LinkRelativeToVault')
                    .addOption(DragAction.EmbedRelativeToHome, 'EmbedRelativeToHome')
                    .addOption(DragAction.EmbedRelativeToVault, 'EmbedRelativeToVault')
                    .addOption(DragAction.InlineLinkRelativeToHome, 'InlineLinkRelativeToHome')
                    .addOption(DragAction.InlineLinkRelativeToVault, 'InlineLinkRelativeToVault')
                    .setValue(value)
                    .onChange(async (value) => {
                        onchangeFn(value);
                    }));
        };

        let ctrlKeyName = 'Ctrl';
        if(Platform.isMacOS){
            ctrlKeyName = 'Option';
        }

        createSetting(`Drag with ${ctrlKeyName}`, 
            `Choose the type of embed or link to create when dragging with ${ctrlKeyName}`, 
            this.plugin.settings.dragWithCtrl,
            (value) => {
                this.plugin.settings.dragWithCtrl = value as DragAction;
                this.plugin.saveSettings();
            });
        createSetting(`Drag with Shift`, 
            `Choose the type of embed or link to create when dragging with Shift`, 
            this.plugin.settings.dragWithShift,
            (value) => {
                this.plugin.settings.dragWithShift = value as DragAction;
                this.plugin.saveSettings();
            });
        createSetting(`Drag with ${ctrlKeyName}+Shift`, 
            `Choose the type of embed or link to create when dragging with ${ctrlKeyName}+Shift`, 
            this.plugin.settings.dragWithCtrlShift,
            (value) => {
                this.plugin.settings.dragWithCtrlShift = value as DragAction;
                this.plugin.saveSettings();
            });

        // Add directories section
        containerEl.createEl('h2', { text: 'Directories' });
        containerEl.createEl('p', { 
            text: 'Configure directory IDs that can be used in embeds and links. Each ID maps to a directory on your computer.' 
        });

        // Create table
        const table = containerEl.createEl('table', { cls: 'directory-table' });
        
        // Create table header
        const thead = table.createEl('thead');
        const headerRow = thead.createEl('tr');
        ['Type', 'ID', 'Path', 'Sync', 'Action'].forEach(text => {
            headerRow.createEl('th', { text });
        });

        // Create table body
        const tbody = table.createEl('tbody');

        // Add predefined directories
        const addDirectoryRow = (type: string, id: string, path: string, sync: boolean = false, showDelete: boolean = false) => {
            const row = tbody.createEl('tr');
            
            // Type column
            row.createEl('td', { text: type });
            
            // ID column
            row.createEl('td', { text: id });
            
            // Path column
            row.createEl('td', { text: path });
            
            // Sync column
            const syncCell = row.createEl('td');
            if (type === 'Custom') {
                new Setting(syncCell)
                    .addToggle(toggle => toggle
                        .setValue(sync)
                        .onChange(async (value) => {
                            const config = this.plugin.settings.customDirectories.find(dir => dir.id === id);
                            if (config) {
                                config.sync = value;
                                await this.plugin.saveSettings();
                            }
                        }));
            }
            
            // Action column
            const actionCell = row.createEl('td');
            if (showDelete) {
                new Setting(actionCell)
                    .addExtraButton(button => button
                        .setIcon('trash')
                        .setTooltip('Delete')
                        .onClick(async () => {
                            const index = this.plugin.settings.customDirectories.findIndex(dir => dir.id === id);
                            if (index !== -1) {
                                this.plugin.settings.customDirectories.splice(index, 1);
                                await this.plugin.saveSettings();
                                this.display(); // Refresh the settings tab
                            }
                        }));
            }
        };

        // Add predefined directories
        addDirectoryRow('Predefined', 'home', this.plugin.context.homeDirectory);
        addDirectoryRow('Predefined', 'vault', this.plugin.context.vaultDirectory);

        // Add custom directories
        this.plugin.settings.customDirectories.forEach(config => {
            addDirectoryRow('Custom', config.id, config.directory, config.sync, true);
        });

        // Add new custom directory form
        const addNewDirectorySetting = new Setting(containerEl)
            .setName('Add New Directory')
            .setDesc('Add a new custom directory configuration');

        const idInput = new TextComponent(addNewDirectorySetting.controlEl)
            .setPlaceholder('Directory ID')
            .setValue('');

        const directoryInput = new TextComponent(addNewDirectorySetting.controlEl)
            .setPlaceholder('Directory Path')
            .setValue('');

        const syncToggle = new Setting(addNewDirectorySetting.controlEl)
            .setName('Sync across computers')
            .addToggle(toggle => toggle
                .setValue(false)
                .onChange(async (value) => {
                    // Handle sync toggle change
                }));

        const addButton = new ButtonComponent(addNewDirectorySetting.controlEl)
            .setButtonText('Add')
            .onClick(async () => {
                const id = idInput.getValue().trim();
                const directory = directoryInput.getValue().trim();
                
                if (!id || !directory) {
                    return;
                }

                // Check if ID already exists
                if (this.plugin.settings.customDirectories.some(dir => dir.id === id)) {
                    return;
                }

                const syncInput = syncToggle.controlEl.querySelector('input');
                if (!syncInput) {
                    return;
                }

                this.plugin.settings.customDirectories.push({
                    id,
                    directory,
                    sync: syncInput.checked
                });

                await this.plugin.saveSettings();
                this.display(); // Refresh the settings tab
            });
    }
}
