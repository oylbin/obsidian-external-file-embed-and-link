import { parseEmbedFolderArguments, filterFolderFiles, EmbedFolderArguments } from './embedProcessor';
import * as fs from 'fs';

describe('parseEmbedFolderArguments', () => {
    test('should parse empty arguments', () => {
        const result = parseEmbedFolderArguments('');
        expect(result.extensions).toEqual([]);
        expect(result.includePatterns).toEqual([]);
        expect(result.excludePatterns).toEqual([]);
    });

    test('should parse single extensions parameter', () => {
        const result = parseEmbedFolderArguments('extensions=pdf,txt');
        expect(result.extensions).toEqual(['pdf', 'txt']);
        expect(result.includePatterns).toEqual([]);
        expect(result.excludePatterns).toEqual([]);
    });

    test('should parse multiple extensions parameters', () => {
        const result = parseEmbedFolderArguments('extensions=pdf,txt&extensions=doc,docx');
        expect(result.extensions).toEqual(['pdf', 'txt', 'doc', 'docx']);
        expect(result.includePatterns).toEqual([]);
        expect(result.excludePatterns).toEqual([]);
    });

    test('should parse include patterns', () => {
        const result = parseEmbedFolderArguments('include=*.pdf,*.txt');
        expect(result.extensions).toEqual([]);
        expect(result.includePatterns).toEqual(['*.pdf', '*.txt']);
        expect(result.excludePatterns).toEqual([]);
    });

    test('should parse exclude patterns', () => {
        const result = parseEmbedFolderArguments('exclude=*.tmp,*.bak');
        expect(result.extensions).toEqual([]);
        expect(result.includePatterns).toEqual([]);
        expect(result.excludePatterns).toEqual(['*.tmp', '*.bak']);
    });

    test('should parse all parameters together', () => {
        const result = parseEmbedFolderArguments('extensions=pdf,txt&include=*.pdf,*.txt&exclude=*.tmp,*.bak');
        expect(result.extensions).toEqual(['pdf', 'txt']);
        expect(result.includePatterns).toEqual(['*.pdf', '*.txt']);
        expect(result.excludePatterns).toEqual(['*.tmp', '*.bak']);
    });

    test('should handle whitespace in values', () => {
        const result = parseEmbedFolderArguments('extensions= pdf , txt &include= *.pdf , *.txt ');
        expect(result.extensions).toEqual(['pdf', 'txt']);
        expect(result.includePatterns).toEqual(['*.pdf', '*.txt']);
    });

    test('should handle case sensitivity in extensions', () => {
        const result = parseEmbedFolderArguments('extensions=PDF,TXT');
        expect(result.extensions).toEqual(['pdf', 'txt']);
    });
});

describe('filterFolderFiles', () => {
    const createMockFile = (name: string, isDirectory = false): fs.Dirent => ({
        name,
        isDirectory: () => isDirectory,
        isFile: () => !isDirectory,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isSymbolicLink: () => false,
        isFIFO: () => false,
        isSocket: () => false,
    });

    test('should return all files when no filters are applied', () => {
        const files = [
            createMockFile('test.pdf'),
            createMockFile('test.txt'),
            createMockFile('test.md'),
        ];
        const args = new EmbedFolderArguments();
        const result = filterFolderFiles(files, args);
        expect(result).toEqual(files);
    });

    test('should filter by extensions', () => {
        const files = [
            createMockFile('test.pdf'),
            createMockFile('test.txt'),
            createMockFile('test.md'),
        ];
        const args = new EmbedFolderArguments();
        args.extensions = ['pdf', 'txt'];
        const result = filterFolderFiles(files, args);
        expect(result).toHaveLength(2);
        expect(result.map(f => f.name)).toEqual(['test.pdf', 'test.txt']);
    });

    test('should filter by include patterns', () => {
        const files = [
            createMockFile('test.pdf'),
            createMockFile('test.txt'),
            createMockFile('test.md'),
        ];
        const args = new EmbedFolderArguments();
        args.includePatterns = ['*.pdf', '*.txt'];
        const result = filterFolderFiles(files, args);
        expect(result).toHaveLength(2);
        expect(result.map(f => f.name)).toEqual(['test.pdf', 'test.txt']);
    });

    test('should filter by exclude patterns', () => {
        const files = [
            createMockFile('test.pdf'),
            createMockFile('test.txt'),
            createMockFile('test.md'),
        ];
        const args = new EmbedFolderArguments();
        args.excludePatterns = ['*.pdf', '*.txt'];
        const result = filterFolderFiles(files, args);
        expect(result).toHaveLength(1);
        expect(result.map(f => f.name)).toEqual(['test.md']);
    });

    test('should apply all filters in correct order', () => {
        const files = [
            createMockFile('test1.pdf'),
            createMockFile('test2.pdf'),
            createMockFile('test.txt'),
            createMockFile('test.md'),
        ];
        const args = new EmbedFolderArguments();
        args.extensions = ['pdf', 'txt'];
        args.includePatterns = ['test1.*'];
        args.excludePatterns = ['*.txt'];
        const result = filterFolderFiles(files, args);
        expect(result).toHaveLength(1);
        expect(result.map(f => f.name)).toEqual(['test1.pdf']);
    });

    test('should sort files alphabetically', () => {
        const files = [
            createMockFile('z.pdf'),
            createMockFile('a.pdf'),
            createMockFile('m.pdf'),
        ];
        const args = new EmbedFolderArguments();
        const result = filterFolderFiles(files, args);
        expect(result.map(f => f.name)).toEqual(['a.pdf', 'm.pdf', 'z.pdf']);
    });

    test('should handle case-insensitive filtering', () => {
        const files = [
            createMockFile('TEST.PDF'),
            createMockFile('test.txt'),
            createMockFile('Test.md'),
        ];
        const args = new EmbedFolderArguments();
        args.extensions = ['pdf', 'txt'];
        const result = filterFolderFiles(files, args);
        expect(result).toHaveLength(2);
        expect(result.map(f => f.name)).toEqual(['TEST.PDF', 'test.txt']);
    });

	test('should filter by exclude patterns', () => {
        const files = [
            createMockFile('a.pdf'),
            createMockFile('test.txt'),
            createMockFile('test.md'),
        ];
        const args = new EmbedFolderArguments();
        args.excludePatterns = ['test.*', '*.txt'];
        const result = filterFolderFiles(files, args);
        expect(result).toHaveLength(1);
        expect(result.map(f => f.name)).toEqual(['a.pdf']);
    });
}); 
