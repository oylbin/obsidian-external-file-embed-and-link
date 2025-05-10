import CrossComputerLinkPlugin from 'main';
import { App, Platform, PluginSettingTab, Setting, TextComponent, ButtonComponent, Notice, Modal } from 'obsidian';
import { VirtualDirectoryManager } from 'VirtualDirectoryManager';
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
			enabled: false
		},
		{
			id: 'add-external-link-relative-to-home',
			name: 'Add external link relative to home',
			enabled: false
		},
		{
			id: 'add-external-inline-link-relative-to-home',
			name: 'Add external inline link relative to home',
			enabled: false
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

	private displayDevices(containerEl: HTMLElement) {
		// Display devices section
		new Setting(containerEl)
		.setName('Devices')
		.setHeading()
		.setDesc('You can change the name of a device to make it more recognizable. New devices will be added automatically when the plugin is first loaded on a new device. ');


		this.virtualDirectoryManager.getAllDevices().forEach(device => {
		let settingName = `Device ID: ${device.uuid.substring(0, 8)}, OS: ${device.os}`;
		if (device.uuid === this.deviceUUID) {
			settingName += ' (Current device)';
		}
		new Setting(containerEl)
			.setName(settingName)
			.addText(text => text
				.setValue(device.name)
				.onChange(async (value) => {
					const oldName = device.name;
					try {
						await this.virtualDirectoryManager.setDeviceName(device.uuid, value);
						// refresh the device list
						this.updateDeviceNameDisplay(device.uuid, value);
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
							// FIXME list all the virtual directories for this device
							`If you delete this device (${device.name}), all the virtual directory settings of this device will be removed. Are you sure you want to continue?`,
							async () => {
								await this.virtualDirectoryManager.removeDevice(device.uuid);
								this.display();
							}
						);
					}						
				}));
		})
	}

	private displayDirectories(containerEl: HTMLElement) {
		// Display directories section
		const homeDirectory = this.virtualDirectoryManager.getLocalDirectory('home');
		const vaultDirectory = this.virtualDirectoryManager.getLocalDirectory('vault');

		new Setting(containerEl)
			.setName('Virtual Directories')
			.setHeading()
			.setDesc(createFragment(f => {
				f.createEl('p', { text: 'Configure virtual directories that can be used to locate files on different devices.' });
				f.createEl('p', { text: 'Predefined virtual directories:' });

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
			.setName('Add new virtual directory')
			.setDesc(createFragment(f => {
				f.appendText('Add a new virtual directory configuration, ');
				f.createEl('code', { text: 'home' });
				f.appendText(' and ');
				f.createEl('code', { text: 'vault' });
				f.appendText(' are predefined');
				const ul = f.createEl('ul');
				ul.createEl('li', {}, li => {
					li.appendText('Virtual directory ');
					li.createEl('code', { text: 'home' });
					li.appendText(' is linked to your home directory: ');
					li.createEl('code', { text: homeDirectory || 'Not set' });
				});
				ul.createEl('li', {}, li => {
					li.appendText('Virtual directory ');
					li.createEl('code', { text: 'vault' });
					li.appendText(' is linked to your vault directory: ');
					li.createEl('code', { text: vaultDirectory || 'Not set' });
				});
			}));

		const nameInput = new TextComponent(addDirectorySetting.controlEl)
			.setPlaceholder('Virtual directory name')
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
			const dirSection = containerEl.createEl('div', { cls: 'virtual-directory-section' });
			new Setting(dirSection)
				// .setName(createFragment(f => {
				// 	f.appendText('Virtual directory: ');
				// 	f.createEl('code', { text: dirName });
				// }))
				.setName(`Virtual directory: ${dirName}`)
				// .setDesc(createFragment(f => {
				// 	f.createEl('p', { text: 'Configure virtual directory settings for different devices.' });
				// }))
				.addExtraButton(button => button
					.setIcon('trash')
					.setTooltip('Delete directory')
					.onClick(async () => {
						this.showConfirmDialog(
							'Confirm Directory Deletion',
							`If you delete this virtual directory (${dirName}), all links using this directory in your notes will be broken. Are you sure you want to continue?`,
							async () => {
								await this.virtualDirectoryManager.deleteDirectory(dirName);
								this.display();
							}
						);
					}));
				this.virtualDirectoryManager.getAllDevices().forEach(device => {
						const item = new Setting(dirSection)
							.setName(createFragment(f => {
								f.createEl('span', { 
									text: device.name,
									cls: `device-name-${device.uuid}`
								});
								f.createEl('span', { text: ` ( Device ID: ${device.uuid.substring(0, 8)}, OS: ${device.os})` });
							}));

						if(device.uuid === this.deviceUUID){
							item.addExtraButton(button => button
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
						item.addText(text => text
							.setValue(devices[device.uuid]?.path || '')
							.onChange(async (value) => {
								try {
									await this.virtualDirectoryManager.setDirectory(dirName, device.uuid, value);
								} catch (error) {
									new Notice(error.message);
								}
							}));
					});
		});


	}

	private updateDeviceNameDisplay(uuid: string, newName: string) {
		const deviceNameCells = document.querySelectorAll(`.device-name-${uuid}`);
		deviceNameCells.forEach(cell => {
			cell.setText(newName);
		});
	}

	display(): void {
		this.virtualDirectoryManager.registerCurrentDevice();
		const { containerEl } = this;
		containerEl.empty();

		// this.displayDragAndDrop(containerEl);
		this.displayDirectories(containerEl);
		this.displayDevices(containerEl);
		// this.displayCommands(containerEl);

	}
}
