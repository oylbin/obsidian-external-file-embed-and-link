# virtual directory

User can create virtual directory to locate files on different devices.

~~~
```EmbedRelativeTo
project1://docs/design.md
```
~~~

`project1` is the name of the virtual directory.

`docs/design.md` is the path to the file relative to the virtual directory.

User can set where the virtual directory is located on different devices in plugin settings.

| Virtual Directory Name | Device UUID | Device Name | Virtual Directory Path |
| --- | --- | --- | --- |
| Project1 | 1234567890 | WindowsPC1 | C:\Users\username\Documents\Project1 |
| Project1 | 0987654321 | MacBookPro1 | /Users/username/workspace/Project1 |





## technical details

1. create Device UUID and Device Name when the plugin is first loaded on a new device.
	1. Device UUID is saved in Home Directory, rather than in the plugin config directory, because it won't sync to other devices.
		1. Windows: %APPDATA%\obsidian\plugins\obsidian-cross-computer-link\device-uuid.txt
		2. macOS: ~/Library/Application Support/obsidian/plugins/obsidian-cross-computer-link/device-uuid.txt
		3. Linux: ~/.config/obsidian/plugins/obsidian-cross-computer-link/device-uuid.txt
2. all the devices info is saved in the plugin config, which located in the vault config directory.
	1. Device Name is default to the hostname of the device, user can change it in the plugin settings.
3. virtual directory config is saved as a json object.

```json
{
	"devices": {
		"1234567890": {
			"name": "WindowsPC1",
			"uuid": "1234567890"
		},
		"0987654321": {
			"name": "MacBookPro1",
			"uuid": "0987654321"
		}
	},
	"virtualDirectories": {
		"project1": {
			"1234567890": {
				"path": "C:/Users/username/projects/Project1",
			},
			"0987654321": {
				"path": "/Users/username/workspace/Project1",
			}
		},
		"docs": {
			"1234567890": {
				"path": "C:/Users/username/documents",
			},
			"0987654321": {
				"path": "/Users/username/documents",
			}
		}
	}
}
```

4. the settings page
	1. show all the devices in a table with two columns: Device UUID and Device Name.
		1. user can edit the device name.
		2. user can delete the device.
		3. user can not add new device, as the new device will be added when the plugin is first loaded on the new device.
	2. seperate virtual directories into sections.
	3. in each section, show each virtual directory as
		1. a table caption with the name of the virtual directory.
			1. user can edit the name of this virtual directory.
			2. user can delete this virtual directory.
		2. a table with two columns: DeviceInfo and Path.
			1. DeviceInfo is such as "WindowsPC1 (1234567890)".
			2. Path is the path to the file relative to the virtual directory.
			3. user can edit the path.
	3. user can add a new virtual directory.

- do not allow to delete current device.
- only show first 8 characters of the device UUID in the setting page.
- virtual directory name should be editable.




