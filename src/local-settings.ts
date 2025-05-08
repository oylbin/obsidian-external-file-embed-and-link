import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';


export const getLocalSettingsDirectory = (manifestId: string) => {
    const platform = os.platform();
    let basePath;

    switch (platform) {
        case 'win32': // Windows
            basePath = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
            break;
        case 'darwin': // macOS
            basePath = path.join(os.homedir(), 'Library', 'Application Support');
            break;
        case 'linux': // Linux
            basePath = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config');
            break;
        default:
            // Fallback to the home directory if the platform is not recognized
            basePath = os.homedir();
            break;
    }
	return path.join(basePath, 'obsidian', 'plugins', manifestId);
}


// Function to get or generate the local machine ID
export async function getLocalMachineId(manifestId: string) {
	const localSettingsDirectory = getLocalSettingsDirectory(manifestId);
	const localIdPath = path.join(localSettingsDirectory, 'local-id.txt');
    try {
        const id = await fs.readFile(localIdPath, 'utf-8');
        return id.trim();
    } catch (error) {
        // If the file doesn't exist, generate a new ID and save it
        const newId = uuidv4();
        // Ensure the directory exists before writing the file
        const dirPath = path.dirname(localIdPath);
        await fs.mkdir(dirPath, { recursive: true });
        await fs.writeFile(localIdPath, newId, 'utf-8');
        return newId;
    }
}

export async function loadLocalSettings(manifestId: string) {
	const localSettingsDirectory = getLocalSettingsDirectory(manifestId);
    const localSettingsPath = path.join(localSettingsDirectory, 'local-settings.json');
    try {
        const data = await fs.readFile(localSettingsPath, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return {};
    }
}

export async function saveLocalSettings(manifestId: string, localSettings: unknown) {
	const localSettingsDirectory = getLocalSettingsDirectory(manifestId);
    const localSettingsPath = path.join(localSettingsDirectory, 'local-settings.json');
    await fs.writeFile(localSettingsPath, JSON.stringify(localSettings), 'utf-8');
}

