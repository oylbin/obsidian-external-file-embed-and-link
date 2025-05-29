// Mock DOMParser
global.DOMParser = class DOMParser {
    parseFromString(string: string, contentType: string) {
        return {
            body: {
                children: []
            }
        };
    }
}; 
