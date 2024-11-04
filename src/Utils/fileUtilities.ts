import fs from 'node:fs';
import path from 'node:path';
import { access, unlink } from 'fs/promises';
import { constants } from 'fs';

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

/**
 * Checks if a file exists at the given path.
 * @param filePath - The path to the file to check.
 * @returns A boolean indicating if the file exists.
 */
export async function fileExists(filePath: string): Promise<boolean> {
    try {
        await access(filePath, constants.F_OK);
        return true;
    } catch (error) {
        if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
            console.error(`${filePath} does not exist`);
            return false;
        }
        console.error('Unexpected error while checking file existence:', error);
        return false;
    }
}

/**
 * Deletes a file if it exists.
 * @param filePath - The path of the file to delete.
 */
export async function deleteFileIfExists(filePath: string): Promise<boolean> {
    try {
        await unlink(filePath);
        return true;
    } catch (error) {
        if (error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
            console.error(`${filePath} does not exist`);
            return false;
        }
        console.error('Unexpected error deleting file', error);
        return false;
    }
}
