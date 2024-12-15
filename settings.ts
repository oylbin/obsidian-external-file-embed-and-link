import CrossComputerLinkPlugin from 'main';
import { App, Platform, PluginSettingTab, Setting } from 'obsidian';
export interface CrossComputerLinkPluginSettings {
	httpServerPort: number;
	dragWithCtrl: 'default' | 'LinkRelativeToHome' | 'LinkRelativeToVault' | 'EmbedRelativeToHome' | 'EmbedRelativeToVault' | 'InlineLinkRelativeToHome' | 'InlineLinkRelativeToVault';
	dragWithShift: 'default' | 'LinkRelativeToHome' | 'LinkRelativeToVault' | 'EmbedRelativeToHome' | 'EmbedRelativeToVault' | 'InlineLinkRelativeToHome' | 'InlineLinkRelativeToVault';
	dragWithCtrlShift: 'default' | 'LinkRelativeToHome' | 'LinkRelativeToVault' | 'EmbedRelativeToHome' | 'EmbedRelativeToVault' | 'InlineLinkRelativeToHome' | 'InlineLinkRelativeToVault';
	enableDragAndDrop: boolean;
}

export const DEFAULT_SETTINGS: CrossComputerLinkPluginSettings = {
	httpServerPort: 11411,
	dragWithCtrl: 'default',
	dragWithShift: 'InlineLinkRelativeToHome',
	dragWithCtrlShift: 'EmbedRelativeToHome',
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
					.addOption('default', 'Obsidian default action')
					.addOption('LinkRelativeToHome', 'LinkRelativeToHome')
					.addOption('LinkRelativeToVault', 'LinkRelativeToVault')
					.addOption('EmbedRelativeToHome', 'EmbedRelativeToHome')
					.addOption('EmbedRelativeToVault', 'EmbedRelativeToVault')
					.addOption('InlineLinkRelativeToHome', 'InlineLinkRelativeToHome')
					.addOption('InlineLinkRelativeToVault', 'InlineLinkRelativeToVault')
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
				this.plugin.settings.dragWithCtrl = value as any;
				this.plugin.saveSettings();
			});
		createSetting(`Drag with Shift`, 
			`Choose the type of embed or link to create when dragging with Shift`, 
			this.plugin.settings.dragWithShift,
			(value) => {
				this.plugin.settings.dragWithShift = value as any;
				this.plugin.saveSettings();
			});
		createSetting(`Drag with ${ctrlKeyName}+Shift`, 
			`Choose the type of embed or link to create when dragging with ${ctrlKeyName}+Shift`, 
			this.plugin.settings.dragWithCtrlShift,
			(value) => {
				this.plugin.settings.dragWithCtrlShift = value as any;
				this.plugin.saveSettings();
			});
	}
}
