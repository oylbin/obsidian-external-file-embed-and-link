import CrossComputerLinkPlugin from 'main';
import { App, Platform, PluginSettingTab, Setting, TextComponent, ButtonComponent, Notice, Modal } from 'obsidian';
import { existsSync } from 'fs';
import * as os from 'os';
export enum DragAction {
	Default = 'default',
	LinkRelativeToHome = 'LinkRelativeToHome',
	LinkRelativeToVault = 'LinkRelativeToVault',
	EmbedRelativeToHome = 'EmbedRelativeToHome',
	EmbedRelativeToVault = 'EmbedRelativeToVault',
	InlineLinkRelativeToHome = 'InlineLinkRelativeToHome',
	InlineLinkRelativeToVault = 'InlineLinkRelativeToVault'
}


export interface DeviceInfo {
	uuid: string;
	name: string;
	os: string;
}

export interface DevicesMap {
	[uuid: string]: DeviceInfo;
}

export interface VirtualDirectoryItem {
	path: string;
}

export interface VirtualDirectoriesMap {
	[name: string]: Record<string, VirtualDirectoryItem>;
}

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
	devices: DevicesMap;
	virtualDirectories: VirtualDirectoriesMap;
	commands: CommandConfig[];
}

export const DEFAULT_SETTINGS: CrossComputerLinkPluginSettings = {
	dragWithCtrl: DragAction.Default,
	dragWithShift: DragAction.InlineLinkRelativeToHome,
	dragWithCtrlShift: DragAction.EmbedRelativeToHome,
	enableDragAndDrop: true,
	virtualDirectories: {},
	devices: {},
	commands: [
		{
			id: 'add-external-embed',
			name: 'Add external embed',
			enabled: true
		},
		{
			id: 'add-external-inline-link',
			name: 'Add external inline link',
			enabled: true
		},
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


export interface VirtualDirectoryManager {
	getAllDevices(): DeviceInfo[];
	setDeviceName(uuid: string, name: string): Promise<void>;
	removeDevice(uuid: string): Promise<void>;

	addDirectory(virtualDirectoryName: string): Promise<void>;
	// TODO also update directory names in obsidian notes?
	// or just warn user to do it manually?
	renameDirectory(virtualDirectoryName: string, newName: string): Promise<void>;
	deleteDirectory(virtualDirectoryName: string): Promise<void>;

	registerCurrentDevice(): void;
	getLocalDirectory(virtualDirectoryName: string): string | null;
	setLocalDirectory(virtualDirectoryName: string, directory: string): Promise<void>;
	setDirectory(virtualDirectoryName: string, uuid: string, directory: string): Promise<void>;
	getAllDirectories(): VirtualDirectoriesMap;
}


export class VirtualDirectoryManagerImpl implements VirtualDirectoryManager {
	private deviceUUID: string;
	constructor(private plugin: CrossComputerLinkPlugin, deviceUUID: string) {
		this.deviceUUID = deviceUUID;
		this.registerCurrentDevice();
	}

	registerCurrentDevice() {
		if (this.plugin.settings.devices[this.deviceUUID]) {
			return;
		}
		let deviceName = os.hostname();
		if (deviceName.length === 0) {
			deviceName = "Unknown";
		}
		this.plugin.settings.devices[this.deviceUUID] = {
			uuid: this.deviceUUID,
			name: deviceName,
			os: os.platform()
		};
	}

	getAllDevices(): DeviceInfo[] {
		return Object.values(this.plugin.settings.devices);
	}

	private checkDeviceName(name: string) {
		if (!/^[a-zA-Z0-9\s\-_.]+$/.test(name)) {
			throw new Error("Invalid device name, only letters, numbers, spaces, dash, dot, and underscore are allowed");
		}
	}

	private checkVirtualDirectoryName(name: string) {
		const lowerName = name.toLowerCase();
		// home, vault, file are reserved
		if (lowerName === 'home' || lowerName === 'vault' || lowerName === 'file') {
			throw new Error("Invalid virtual directory name, home, vault, and file are reserved");
		}
		if (!/^[a-zA-Z0-9]+$/.test(name)) {
			throw new Error("Invalid virtual directory name, only letters and numbers are allowed");
		}
	}

	setDeviceName(uuid: string, name: string): Promise<void> {
		// check if the device exists
		if (!this.plugin.settings.devices[uuid]) {
			throw new Error("Device not found");
		}
		this.checkDeviceName(name);
		this.plugin.settings.devices[uuid].name = name;
		return this.plugin.saveSettings();
	}

	removeDevice(uuid: string): Promise<void> {
		delete this.plugin.settings.devices[uuid];
		// remove all the directories for this device
		Object.keys(this.plugin.settings.virtualDirectories).forEach(virtualDirectoryName => {
			delete this.plugin.settings.virtualDirectories[virtualDirectoryName][uuid];
		});
		return this.plugin.saveSettings();
	}

	addDirectory(virtualDirectoryName: string): Promise<void> {
		if (this.plugin.settings.virtualDirectories[virtualDirectoryName]) {
			throw new Error("Directory already exists");
		}
		this.checkVirtualDirectoryName(virtualDirectoryName);
		this.plugin.settings.virtualDirectories[virtualDirectoryName] = {};
		return this.plugin.saveSettings();
	}

	renameDirectory(virtualDirectoryName: string, newName: string): Promise<void> {
		if (this.plugin.settings.virtualDirectories[newName]) {
			throw new Error("Directory already exists");
		}
		this.checkVirtualDirectoryName(newName);
		this.plugin.settings.virtualDirectories[newName] = this.plugin.settings.virtualDirectories[virtualDirectoryName];
		delete this.plugin.settings.virtualDirectories[virtualDirectoryName];
		return this.plugin.saveSettings();
	}

	deleteDirectory(virtualDirectoryName: string): Promise<void> {
		delete this.plugin.settings.virtualDirectories[virtualDirectoryName];
		return this.plugin.saveSettings();
	}

	getLocalDirectory(virtualDirectoryName: string): string | null {
		if (!this.plugin.settings.virtualDirectories[virtualDirectoryName]) {
			return null;
		}
		if (!this.plugin.settings.virtualDirectories[virtualDirectoryName][this.deviceUUID]) {
			return null;
		}
		return this.plugin.settings.virtualDirectories[virtualDirectoryName][this.deviceUUID].path;
	}

	setLocalDirectory(virtualDirectoryName: string, directory: string): Promise<void> {

		// check if the directory exists
		if (!existsSync(directory)) {
			throw new Error("Directory does not exist");
		}
		return this.setDirectory(virtualDirectoryName, this.deviceUUID, directory);
	}

	setDirectory(virtualDirectoryName: string, uuid: string, directory: string): Promise<void> {
		if (!this.plugin.settings.virtualDirectories[virtualDirectoryName]) {
			this.plugin.settings.virtualDirectories[virtualDirectoryName] = {};
		}
		this.plugin.settings.virtualDirectories[virtualDirectoryName][uuid] = {
			path: directory
		};
		return this.plugin.saveSettings();
	}

	getAllDirectories(): VirtualDirectoriesMap {
		return this.plugin.settings.virtualDirectories;
	}

}


export class CrossComputerLinkSettingTab extends PluginSettingTab {
	plugin: CrossComputerLinkPlugin;
	virtualDirectoryManager: VirtualDirectoryManager;
	deviceUUID: string;

	constructor(app: App, plugin: CrossComputerLinkPlugin, virtualDirectoryManager: VirtualDirectoryManager, deviceUUID: string) {
		super(app, plugin);
		this.plugin = plugin;
		this.virtualDirectoryManager = virtualDirectoryManager;
		this.deviceUUID = deviceUUID;
	}

	private showConfirmDialog(title: string, message: string, onConfirm: () => Promise<void>) {
		const confirmModal = new Modal(this.app);
		confirmModal.titleEl.setText(title);
		confirmModal.contentEl.createEl('p', {
			text: message
		});

		const buttonContainer = confirmModal.contentEl.createDiv({ cls: 'modal-button-container' });

		const cancelButton = buttonContainer.createEl('button', { text: 'Cancel' });
		cancelButton.addEventListener('click', () => {
			confirmModal.close();
		});

		const confirmButton = buttonContainer.createEl('button', { text: 'Confirm', cls: 'mod-warning' });
		confirmButton.addEventListener('click', async () => {
			try {
				await onConfirm();
				confirmModal.close();
			} catch (error) {
				new Notice(error.message);
			}
		});

		confirmModal.open();
	}

	private displayCommands(containerEl: HTMLElement) {

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

	private displayDragAndDrop(containerEl: HTMLElement) {
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

	private displayDirectories(containerEl: HTMLElement) {
		// Display devices section
		new Setting(containerEl)
			.setName('Devices')
			.setHeading()
			.setDesc(createFragment(f => {
				f.createEl('p', { text: 'Configure device names. New devices will be added automatically when the plugin is first loaded.' });
				f.createEl('p', {}, p => {
					p.appendText('Learn more about ');
					p.createEl('a', {
						text: 'device management',
						href: 'https://github.com/your-repo/your-plugin'
					});
					p.appendText('.');
				});
			}));

		this.virtualDirectoryManager.getAllDevices().forEach(device => {
			let settingName = `Device ID: ${device.uuid.substring(0, 8)}`;
			if (device.uuid === this.deviceUUID) {
				settingName += ' (Current device)';
			}
			new Setting(containerEl)
				.setName(settingName)
				.setDesc(`OS: ${device.os}`)
				.addText(text => text
					.setValue(device.name)
					.onChange(async (value) => {
						const oldName = device.name;
						try {
							await this.virtualDirectoryManager.setDeviceName(device.uuid, value);
						} catch (error) {
							new Notice(error.message);
							// revert the change
							this.virtualDirectoryManager.setDeviceName(device.uuid, oldName);
							// set the text back to the old name
							text.setValue(oldName);
						}
					}))
				.addExtraButton(button => button
					.setIcon('trash')
					.setTooltip('Delete device')
					.onClick(async () => {
						if(device.uuid === this.deviceUUID){
							// show a dialog to tell user can not delete current device
							new Notice('Cannot delete current device.');
							return;
						}else{
							this.showConfirmDialog(
								'Confirm Device Deletion',
								`If you delete this device (${device.name}), all the virtual directory settings of this device will be removed. Are you sure you want to continue?`,
								async () => {
									await this.virtualDirectoryManager.removeDevice(device.uuid);
									this.display();
								}
							);
						}						
					}));
		})

		const showPredefinedDirectories = false;

		if (showPredefinedDirectories) {
			// Display virtual directories section
			new Setting(containerEl)
				.setName('Predefined virtual directories')
				.setDesc('You can not change the path of these directories as they are resolved automatically.');

			// create a table for predefined virtual directories
			const predefinedDirectoriesTable = containerEl.createEl('table', { cls: 'predefined-directories-table' });
			const predefinedDirectoriesThead = predefinedDirectoriesTable.createEl('thead');
			const predefinedDirectoriesHeaderRow = predefinedDirectoriesThead.createEl('tr');
			['Directory Name', 'Path'].forEach(text => {
				predefinedDirectoriesHeaderRow.createEl('th', { text });
			});

			const predefinedDirectories = [
				{
					name: 'home',
					path: process.env.HOME || process.env.USERPROFILE || ''
				},
				{
					name: 'vault',
					// @ts-ignore
					path: this.app.vault.adapter.basePath
				}
			]

			const predefinedDirectoriesTbody = predefinedDirectoriesTable.createEl('tbody');
			predefinedDirectories.forEach((directory, index) => {
				const row = predefinedDirectoriesTbody.createEl('tr');
				row.createEl('td', { text: directory.name });
				row.createEl('td', { text: directory.path });
			});
		}

		// containerEl.createEl('hr');
		// containerEl.createEl('h2', { text: 'User-Defined Virtual Directories' });

		const userDefinedDirectoriesSection = new Setting(containerEl)
			.setName('User-Defined Virtual Directories')
			.setHeading()
			.setDesc(createFragment(f => {
				f.createEl('p', { text: 'Configure virtual directories that can be used to locate files on different devices.' });
				f.createEl('p', { text: 'For example:' });
				const ul = f.createEl('ul');
				ul.createEl('li', {}, li => {
					li.appendText('Create a ');
					li.createEl('code', { text: 'projects' });
					li.appendText(' directory to link to your project files');
				});
				ul.createEl('li', {}, li => {
					li.appendText('Create a ');
					li.createEl('code', { text: 'documents' });
					li.appendText(' directory to link to your documents');
				});
				f.createEl('p', {}, p => {
					p.appendText('Learn more about ');
					p.createEl('a', {
						text: 'virtual directories',
						href: 'https://github.com/your-repo/your-plugin#virtual-directories'
					});
					p.appendText('.');
				});
			}));
		
		

		// Add new virtual directory button
		const addDirectorySetting = new Setting(containerEl)
			.setName('Add New Virtual Directory')
			.setDesc('Add a new virtual directory configuration');

		const nameInput = new TextComponent(addDirectorySetting.controlEl)
			.setPlaceholder('Directory name')
			.setValue('');

		new ButtonComponent(addDirectorySetting.controlEl)
			.setButtonText('Add')
			.onClick(async () => {
				try {
					const name = nameInput.getValue().trim();
					await this.virtualDirectoryManager.addDirectory(name);
					this.display();
				} catch (error) {
					new Notice(error.message);
				}
			});

		// Display existing virtual directories
		const directories = this.virtualDirectoryManager.getAllDirectories();
		Object.entries(directories).forEach(([dirName, devices]) => {
			// Create section for each virtual directory
			const dirSection = containerEl.createEl('div', { cls: 'virtual-directory-section' });

			// Directory name with edit functionality
			const dirHeader = dirSection.createEl('div', { cls: 'directory-header' });
			new Setting(dirHeader)
				.setName("Directory name")
				.addText(text => text
					.setValue(dirName)
					.onChange(async (value) => {
						if (value && value !== dirName) {
							try {
								await this.virtualDirectoryManager.renameDirectory(dirName, value);
								this.display();
							} catch (error) {
								new Notice(error.message);
							}
						}
					}))
				.addExtraButton(button => button
					.setIcon('trash')
					.setTooltip('Delete directory')
					.onClick(async () => {
						this.showConfirmDialog(
							'Confirm Directory Deletion',
							`If you delete this virtual directory (${dirName}), all links using this directory in your notes will be broken. Are you sure you want to continue?`,
							async () => {
								try {
									await this.virtualDirectoryManager.deleteDirectory(dirName);
									this.display();
								} catch (error) {
									new Notice(error.message);
								}
							});
					}));

			// Create table for device paths
			const dirTable = dirSection.createEl('table', { cls: 'directory-paths-table' });
			const dirThead = dirTable.createEl('thead');
			const dirHeaderRow = dirThead.createEl('tr');
			['Device ID', 'OS', 'Device Name', 'Path', ''].forEach(text => {
				dirHeaderRow.createEl('th', { text });
			});

			const dirTbody = dirTable.createEl('tbody');
			this.virtualDirectoryManager.getAllDevices().forEach(device => {
				const row = dirTbody.createEl('tr');

				//const deviceInfoStr = `${device.uuid.substring(0, 8)} - ${device.os} - ${device.name}`;

				// Device info column - only show first 8 characters of UUID
				row.createEl('td', { text: device.uuid.substring(0, 8) });
				row.createEl('td', { text: device.os });
				row.createEl('td', { text: device.name });

				// Path column with edit functionality
				const pathCell = row.createEl('td');
				new Setting(pathCell)
					.addText(text => text
						.setValue(devices[device.uuid]?.path || '')
						.onChange(async (value) => {
							try {
								await this.virtualDirectoryManager.setDirectory(dirName, device.uuid, value);
							} catch (error) {
								new Notice(error.message);
							}
						}));

				// Action column
				const actionCell = row.createEl('td');
				// if this is the current device, show a button to open a file browser to let user select a directory
				if (device.uuid === this.deviceUUID) {
					new Setting(actionCell)
						.addExtraButton(button => button
							.setIcon('folder')
							.setTooltip('Open file browser')
							.onClick(async () => {
								// @ts-ignore
								// eslint-disable-next-line @typescript-eslint/no-var-requires
								const { remote } = require('electron');
								const dialog = remote.dialog;
								const result = await dialog.showOpenDialog({
									properties: ['openDirectory'],
								});
								if (!result.canceled && result.filePaths.length > 0) {
									const path = result.filePaths[0];
									try {
										await this.virtualDirectoryManager.setLocalDirectory(dirName, path);
										this.display();
									} catch (error) {
										new Notice(error.message);
									}
								}
							}));
				}
			});
		});
	}

	display(): void {
		this.virtualDirectoryManager.registerCurrentDevice();
		const { containerEl } = this;
		containerEl.empty();

		// this.displayCommands(containerEl);
		// this.displayDragAndDrop(containerEl);
		this.displayDirectories(containerEl);

	}
}
