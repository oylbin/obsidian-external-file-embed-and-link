# Changelog

All notable changes to the External File Embed and Link plugin will be documented in this file.

## [1.5.0]

### Added
- **Virtual Directory System**: Introduced a flexible virtual directory system
  - No longer limited to using home or vault directories as starting paths
  - Map any local directory to a virtual directory ID
  - Configure different paths per device for the same virtual directory ID
  - Format: `VirtualDirectoryId://relative/path/to/file`
  - Home and vault directories are pre-defined as virtual directories

- **New Commands**: Streamlined command palette options
  - `Add external embed`: Opens a dialog to select a virtual directory and file for embedding
  - `Add external inline link`: Opens a dialog to select a virtual directory and file for linking
  - Both commands generate the appropriate code automatically

- **Improved Error Handling**: More descriptive error messages
  - Detailed context information when files cannot be found
  - Clearer guidance on how to resolve common issues

### Changed
- **New Embed Syntax**: Introduced `EmbedRelativeTo` as the preferred syntax
  ```
  ```EmbedRelativeTo
  home://SynologyDrive/README.md
  ```
  ```
  - Legacy `EmbedRelativeToHome` and `EmbedRelativeToVault` still supported but deprecated

- **New Link Syntax**: Introduced `LinkRelativeTo` as the preferred syntax
  - New: `<a href="#home://Makefile" class="LinkRelativeTo">Makefile</a>`
  - Legacy class attributes `LinkRelativeToHome` and `LinkRelativeToVault` still supported but deprecated

### Removed
- **Drag & Drop Functionality**: Temporarily disabled
  - With multiple virtual directories, determining the correct target directory from drag & drop became ambiguous
  - May be reimplemented in the future with a directory selection dialog
  - Commands now provide a more controlled alternative for adding embeds and links 