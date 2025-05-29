// Mock DOMParser
export {};

declare global {
    interface DOMParser {
        parseFromString(string: string, contentType: string): Document;
    }
}

global.DOMParser = class DOMParser {
    parseFromString(string: string, contentType: string): Document {
        return {
            body: {
                children: []
            }
        } as unknown as Document;
    }
}; 
