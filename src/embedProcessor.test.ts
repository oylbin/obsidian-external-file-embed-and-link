import { parseEmbedFolderArguments } from './embedProcessor';

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
