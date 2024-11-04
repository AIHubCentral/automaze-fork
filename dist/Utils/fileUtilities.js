"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFiles = getAllFiles;
exports.fileExists = fileExists;
exports.deleteFileIfExists = deleteFileIfExists;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const promises_1 = require("fs/promises");
const fs_1 = require("fs");
/**
 * Recursively collects and returns all file paths within a given directory.
 * It traverses all subdirectories and includes their files, ensuring no duplicates.
 */
function getAllFiles(directory) {
    const currentFiles = new Set();
    for (const directoryItem of node_fs_1.default.readdirSync(directory)) {
        const filePath = node_path_1.default.join(directory, directoryItem);
        if (node_fs_1.default.lstatSync(filePath).isDirectory()) {
            getAllFiles(filePath).forEach((file) => currentFiles.add(file));
        }
        else {
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
async function fileExists(filePath) {
    try {
        await (0, promises_1.access)(filePath, fs_1.constants.F_OK);
        return true;
    }
    catch (error) {
        if (error instanceof Error && error.code === 'ENOENT') {
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
async function deleteFileIfExists(filePath) {
    try {
        await (0, promises_1.unlink)(filePath);
        return true;
    }
    catch (error) {
        if (error instanceof Error && error.code === 'ENOENT') {
            console.error(`${filePath} does not exist`);
            return false;
        }
        console.error('Unexpected error deleting file', error);
        return false;
    }
}
