import fs from 'node:fs';
import path from 'node:path';

/**
 * Recursively collects and returns all file paths within a given directory.
 * It traverses all subdirectories and includes their files, ensuring no duplicates.
 */
export function getAllFiles(directory: string): string[] {
    const currentFiles = new Set<string>();

    for (const directoryItem of fs.readdirSync(directory)) {
        const filePath = path.join(directory, directoryItem);
        if (fs.lstatSync(filePath).isDirectory()) {
            getAllFiles(filePath).forEach((file) => currentFiles.add(file));
        } else {
            currentFiles.add(filePath);
        }
    }

    return Array.from(currentFiles);
}
