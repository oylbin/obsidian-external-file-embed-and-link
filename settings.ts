import CrossComputerLinkPlugin from 'main';
import { App, PluginSettingTab, Setting } from 'obsidian';
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

		new Setting(containerEl)
		.setName('Drag with Ctrl')
		.setDesc('Choose the type of embed or link to create when dragging with Ctrl')
		.addDropdown(dropdown => dropdown
			.addOption('default', 'Obsidian default action')
			.addOption('LinkRelativeToHome', 'LinkRelativeToHome')
			.addOption('LinkRelativeToVault', 'LinkRelativeToVault')
			.addOption('EmbedRelativeToHome', 'EmbedRelativeToHome')
			.addOption('EmbedRelativeToVault', 'EmbedRelativeToVault')
			.addOption('InlineLinkRelativeToHome', 'InlineLinkRelativeToHome')
			.addOption('InlineLinkRelativeToVault', 'InlineLinkRelativeToVault')
			.setValue(this.plugin.settings.dragWithCtrl || 'default')
			.onChange(async (value) => {
				this.plugin.settings.dragWithCtrl = value as 'default' | 'LinkRelativeToHome' | 'LinkRelativeToVault' | 'EmbedRelativeToHome' | 'EmbedRelativeToVault' | 'InlineLinkRelativeToHome' | 'InlineLinkRelativeToVault';
				await this.plugin.saveSettings();
			}));
		new Setting(containerEl)
			.setName('Drag with Shift')
			.setDesc('Choose the type of embed or link to create when dragging with Shift')
			.addDropdown(dropdown => dropdown
				.addOption('default', 'Obsidian default action')
				.addOption('LinkRelativeToHome', 'LinkRelativeToHome')
				.addOption('LinkRelativeToVault', 'LinkRelativeToVault')
				.addOption('EmbedRelativeToHome', 'EmbedRelativeToHome')
				.addOption('EmbedRelativeToVault', 'EmbedRelativeToVault')
				.addOption('InlineLinkRelativeToHome', 'InlineLinkRelativeToHome')
				.addOption('InlineLinkRelativeToVault', 'InlineLinkRelativeToVault')
				.setValue(this.plugin.settings.dragWithShift || 'LinkRelativeToHome')
				.onChange(async (value) => {
					this.plugin.settings.dragWithShift = value as 'default' | 'LinkRelativeToHome' | 'LinkRelativeToVault' | 'EmbedRelativeToHome' | 'EmbedRelativeToVault' | 'InlineLinkRelativeToHome' | 'InlineLinkRelativeToVault';
					await this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName('Drag with Ctrl+Shift')
			.setDesc('Choose the type of embed or link to create when dragging with Ctrl+Shift')
			.addDropdown(dropdown => dropdown
				.addOption('default', 'Obsidian default action')
				.addOption('LinkRelativeToHome', 'LinkRelativeToHome')
				.addOption('LinkRelativeToVault', 'LinkRelativeToVault')
				.addOption('EmbedRelativeToHome', 'EmbedRelativeToHome')
				.addOption('EmbedRelativeToVault', 'EmbedRelativeToVault')
				.addOption('InlineLinkRelativeToHome', 'InlineLinkRelativeToHome')
				.addOption('InlineLinkRelativeToVault', 'InlineLinkRelativeToVault')
				.setValue(this.plugin.settings.dragWithCtrlShift || 'EmbedRelativeToHome')
				.onChange(async (value) => {
					this.plugin.settings.dragWithCtrlShift = value as 'default' | 'LinkRelativeToHome' | 'LinkRelativeToVault' | 'EmbedRelativeToHome' | 'EmbedRelativeToVault' | 'InlineLinkRelativeToHome' | 'InlineLinkRelativeToVault';
					await this.plugin.saveSettings();
				}));

	}
}
