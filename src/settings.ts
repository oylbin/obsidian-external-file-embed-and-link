import CrossComputerLinkPlugin from 'main';
import { App, Platform, PluginSettingTab, Setting, TextComponent, ButtonComponent, Notice } from 'obsidian';
import { existsSync } from 'fs';
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
	directory: string | null;					// 如果为 null，则表示该配置项是在不同的机器上有不同的配置，需要读取 directories
	directories: Record<string, string> | null;	// 如果为 null，则表示该配置项是在不同的机器上是相同的配置，需要读取 directory
}
type CustomDirectoryMap = Record<string, CustomDirectoryConfig>;

export interface CommandConfig {
	id: string;
	name: string;
	enabled: boolean;
}

export interface CrossComputerLinkPluginSettings {
	dragWithCtrl: DragAction;
	dragWithShift: DragAction;
	dragWithCtrlShift: DragAction;
	enableDragAndDrop: boolean;
	customDirectories: CustomDirectoryMap;
	commands: CommandConfig[];
}

export const DEFAULT_SETTINGS: CrossComputerLinkPluginSettings = {
	dragWithCtrl: DragAction.Default,
	dragWithShift: DragAction.InlineLinkRelativeToHome,
	dragWithCtrlShift: DragAction.EmbedRelativeToHome,
	enableDragAndDrop: true,
	customDirectories: {},
	commands: [
		{
			id: 'add-external-embed-relative-to-home',
			name: 'Add external embed relative to home',
			enabled: true
		},
		{
			id: 'add-external-link-relative-to-home',
			name: 'Add external link relative to home',
			enabled: false
		},
		{
			id: 'add-external-inline-link-relative-to-home',
			name: 'Add external inline link relative to home',
			enabled: true
		},
		{
			id: 'add-external-embed-relative-to-vault',
			name: 'Add external embed relative to vault',
			enabled: false
		},
		{
			id: 'add-external-link-relative-to-vault',
			name: 'Add external link relative to vault',
			enabled: false
		},
		{
			id: 'add-external-inline-link-relative-to-vault',
			name: 'Add external inline link relative to vault',
			enabled: false
		}
	]
}

class DirectoryConfigForSettingPage {
	id: string;
	directory: string;
	sync: boolean;
	showDelete: boolean;
	type: 'Predefined' | 'Custom';
}



export interface DirectoryConfigManager {
	getDirectoryById(id: string): string | null;
	deleteDirectoryById(id: string): Promise<void>;
	addDirectory(id: string, directory: string, sync: boolean): Promise<void>;
	getAllDirectories(): DirectoryConfigForSettingPage[];
}


export class DirectoryConfigManagerImpl implements DirectoryConfigManager {
	private directories: Record<string, DirectoryConfigForSettingPage>;
	private localMachineId: string;
	constructor(private plugin: CrossComputerLinkPlugin, localMachineId: string) {
		this.localMachineId = localMachineId;
		this.updateDirectoriesFromSettings();
	}

	private updateDirectoriesFromSettings() {
		this.directories = {};
		this.directories['home'] = {
			id: 'home',
			directory: this.plugin.context.homeDirectory,
			sync: false,
			showDelete: false,
			type: 'Predefined'
		};
		this.directories['vault'] = {
			id: 'vault',
			directory: this.plugin.context.vaultDirectory,
			sync: false,
			showDelete: false,
			type: 'Predefined'
		};

		if (this.plugin.settings.customDirectories) {
			Object.entries(this.plugin.settings.customDirectories).forEach(([key, config]) => {
				if (config.directories === null) {
					this.directories[key] = {
						id: key,
						directory: config.directory || "",
						sync: true,
						showDelete: true,
						type: 'Custom'
					};
				} else {
					Object.entries(config.directories).forEach(([machineId, directory]) => {
						console.log(key, machineId, directory);
					});
					Object.entries(config.directories).forEach(([machineId, directory]) => {
						if (machineId === this.localMachineId) {
							this.directories[key] = {
								id: key,
								directory: directory,
								sync: false,
								showDelete: true,
								type: 'Custom'
							};
						}
					});
				}
			});
		}
	}

	getDirectoryById(id: string): string | null {
		return this.directories[id]?.directory || null;
	}

	async deleteDirectoryById(id: string): Promise<void> {
		const existingConfig = this.plugin.settings.customDirectories[id];
		if (existingConfig.directories === null) {
			delete this.plugin.settings.customDirectories[id];
		} else {
			delete existingConfig.directories[this.localMachineId];
			if (Object.keys(existingConfig.directories).length === 0) {
				delete this.plugin.settings.customDirectories[id];
			}
		}
		await this.plugin.saveSettings();
		this.updateDirectoriesFromSettings();
	}

	async addDirectory(id: string, directory: string, syncValue: boolean): Promise<void> {

		id = id.trim().toLowerCase();
		directory = directory.trim();

		if (id === 'home' || id === 'vault') {
			throw new Error("Please enter a valid ID, home and vault are predefined");
		}
		if(id === 'file'){
			// "file" is also reserved for file system path, maybe in the future we can use it to embed absolute file system path like "file://"
			throw new Error("Please enter a valid ID, file is reserved for file system path");
		}

		if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(id)) {
			throw new Error("Please enter a valid ID, only letters and numbers are allowed, and the first character must be a letter, " + id + " is not a valid ID");
		}

		if (!directory) {
			throw new Error("Please enter a valid directory path");
		}

		if (!existsSync(directory)) {
			throw new Error("Please enter a valid directory path, " + directory + " does not exist");
		}

		if (this.plugin.settings.customDirectories[id]) {
			const existingConfig = this.plugin.settings.customDirectories[id];
			if (existingConfig.directory !== null) {
				// this is a sync directory, so we can not add a new directory to it
				throw new Error("Please enter a valid ID, " + id + " already exists and points to " + existingConfig.directory);
			}
			if (existingConfig.directories === null) {
				// this is a local directory, so we can add a new directory to it
				existingConfig.directories = {};
				existingConfig.directories[this.localMachineId] = directory;
			} else {
				if (existingConfig.directories[this.localMachineId]) {
					// this is a local directory, with local machine id already exists
					throw new Error("Please enter a valid ID, " + id + " already exists and points to " + existingConfig.directories[this.localMachineId]);
				}
				existingConfig.directories[this.localMachineId] = directory;
			}
		} else {
			if (!syncValue) {
				this.plugin.settings.customDirectories[id] = {
					directory: null,
					directories: {
						[this.localMachineId]: directory
					}
				};
			} else {
				this.plugin.settings.customDirectories[id] = {
					directory: directory,
					directories: null
				};
			}
		}

		console.log(this.plugin.settings.customDirectories);

		await this.plugin.saveSettings();
		this.updateDirectoriesFromSettings();
	}

	getAllDirectories(): DirectoryConfigForSettingPage[] {

		return Object.values(this.directories);
	}
}


export class CrossComputerLinkSettingTab extends PluginSettingTab {
	plugin: CrossComputerLinkPlugin;
	directoryConfigManager: DirectoryConfigManager;
	localMachineId: string;

	constructor(app: App, plugin: CrossComputerLinkPlugin, directoryConfigManager: DirectoryConfigManager, localMachineId: string) {
		super(app, plugin);
		this.plugin = plugin;
		this.directoryConfigManager = directoryConfigManager;
		this.localMachineId = localMachineId;
	}

	display(): void {
		console.log("display");
		const { containerEl } = this;
		containerEl.empty();




		{
			// Add commands section
			containerEl.createEl('h2', { text: 'Commands' });
			containerEl.createEl('p', {
				text: 'Enable or disable commands for adding external embeds and links.'
			});
			// Create commands table
			const table = containerEl.createEl('table', { cls: 'commands-table' });

			// Create table header
			const thead = table.createEl('thead');
			const headerRow = thead.createEl('tr');
			['Enable', 'Command'].forEach(text => {
				headerRow.createEl('th', { text });
			});

			// Create table body
			const tbody = table.createEl('tbody');
			// Add command rows
			this.plugin.settings.commands.forEach((command, index) => {
				const row = tbody.createEl('tr');

				// Enable column
				const enableCell = row.createEl('td');
				new Setting(enableCell)
					.addToggle(toggle => toggle
						.setValue(command.enabled)
						.onChange(async (value) => {
							this.plugin.settings.commands[index].enabled = value;
							await this.plugin.saveSettings();
						}));

				// Command name column
				row.createEl('td', { text: command.name });
			});
		}


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
		const addDirectoryRow = (type: string, id: string, path: string, sync = false, showDelete = false) => {
			const row = tbody.createEl('tr');

			// Type column
			row.createEl('td', { text: type });

			// ID column
			row.createEl('td', { text: id });

			// Path column
			row.createEl('td', { text: path });

			// Sync column
			const syncCell = row.createEl('td');
			// if (type === 'Custom') {
			//     new Setting(syncCell)
			//         .addToggle(toggle => toggle
			//             .setValue(sync)
			//             .onChange(async (value) => {
			//                 const config = this.plugin.settings.customDirectories.find(dir => dir.id === id);
			//                 if (config) {
			//                     config.sync = value;
			//                     await this.plugin.saveSettings();
			//                 }
			//             }));
			// }
			syncCell.createEl('span', { text: (id === 'home' || id === 'vault') ? '' : (sync ? 'Yes' : 'No') });
			// Action column
			const actionCell = row.createEl('td');
			if (showDelete) {
				new Setting(actionCell)
					.addExtraButton(button => button
						.setIcon('trash')
						.setTooltip('Delete')
						.onClick(async () => {
							await this.directoryConfigManager.deleteDirectoryById(id);
							this.display();
						}));
			}
		};

		this.directoryConfigManager.getAllDirectories().forEach((config) => {
			addDirectoryRow(config.type, config.id, config.directory, config.sync, config.showDelete);
		});

		// Add custom directories
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

		let syncValue = false;
		new Setting(addNewDirectorySetting.controlEl)
			.setName('Sync across computers')
			.addToggle(toggle => toggle
				.setValue(syncValue)
				.onChange(async (value) => {
					syncValue = value;
				}));

		new ButtonComponent(addNewDirectorySetting.controlEl)
			.setButtonText('Add')
			.onClick(async () => {
				try {
					const id = idInput.getValue().trim();
					const directory = directoryInput.getValue().trim();
					await this.directoryConfigManager.addDirectory(id, directory, syncValue);
					this.display(); // Refresh the settings tab
				} catch (error) {
					new Notice(error.message);
				}
			});

		if (Platform.isMacOS || Platform.isWin) {

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
			if (Platform.isMacOS) {
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
		}
	}
}
