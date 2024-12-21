import CrossComputerLinkPlugin from 'main';
import { App, Platform, PluginSettingTab, Setting } from 'obsidian';

export enum DragAction {
    Default = 'default',
    LinkRelativeToHome = 'LinkRelativeToHome',
    LinkRelativeToVault = 'LinkRelativeToVault',
    EmbedRelativeToHome = 'EmbedRelativeToHome',
    EmbedRelativeToVault = 'EmbedRelativeToVault',
    InlineLinkRelativeToHome = 'InlineLinkRelativeToHome',
    InlineLinkRelativeToVault = 'InlineLinkRelativeToVault'
}

export interface CrossComputerLinkPluginSettings {
	dragWithCtrl: DragAction;
	dragWithShift: DragAction;
	dragWithCtrlShift: DragAction;
	enableDragAndDrop: boolean;
}

export const DEFAULT_SETTINGS: CrossComputerLinkPluginSettings = {
	dragWithCtrl: DragAction.Default,
	dragWithShift: DragAction.InlineLinkRelativeToHome,
	dragWithCtrlShift: DragAction.EmbedRelativeToHome,
	enableDragAndDrop: true,
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
	}
}
