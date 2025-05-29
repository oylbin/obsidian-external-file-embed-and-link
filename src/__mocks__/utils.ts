export const ImageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'];
export const VideoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
export const MarkdownExtensions = ['.md', '.markdown'];

export const isImage = (path: string) => ImageExtensions.some(ext => path.toLowerCase().endsWith(ext));
export const isVideo = (path: string) => VideoExtensions.some(ext => path.toLowerCase().endsWith(ext));
export const isAudio = (path: string) => false;
export const isPDF = (path: string) => path.toLowerCase().endsWith('.pdf');
export const isMarkdown = (path: string) => MarkdownExtensions.some(ext => path.toLowerCase().endsWith(ext));

export const openFileWithDefaultProgram = (path: string, callback: (error: Error | null) => void) => {
    callback(null);
};

export const extractHeaderSection = async (content: string, header: string) => {
    return content;
}; 
