import { VirtualDirectoriesMap } from "settings";
import { DeviceInfo } from "settings";
import { existsSync } from "fs";
import * as os from "os";
import CrossComputerLinkPlugin from "main";

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

		if(virtualDirectoryName === 'home'){
			return process.env.HOME || process.env.USERPROFILE || '';
		}
		if(virtualDirectoryName === 'vault'){
			// @ts-ignore
			return this.plugin.app.vault.adapter.basePath;
		}
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