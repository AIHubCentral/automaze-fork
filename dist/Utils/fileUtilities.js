"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllFiles = getAllFiles;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
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
