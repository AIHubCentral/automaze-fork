"use strict";
/* Initialize knex database and create tables */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const promises_1 = require("fs/promises");
const fs_1 = require("fs");
const node_path_1 = __importDefault(require("node:path"));
const db_1 = __importDefault(require("../db"));
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
(async () => {
    const environment = process.env.NODE_ENV || 'development';
    console.log('Estabilishing connection...');
    // Use SQLite on development env
    if (environment === 'development') {
        const RESOURCES_DATABASE_PATH = node_path_1.default.join(process.cwd(), 'database', 'resources.sqlite');
        const databaseFileExists = await fileExists(RESOURCES_DATABASE_PATH);
        if (databaseFileExists) {
            console.log(`${RESOURCES_DATABASE_PATH} already exists...Skipping`);
            return;
        }
    }
    try {
        await db_1.default.migrate.latest();
        console.log('Migration run successfully.');
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Failed to run migrations', error.message);
        }
        else {
            console.error('Unknown error occurred during database initialization.');
        }
    }
    finally {
        await db_1.default.destroy();
        console.log('Connection closed');
    }
})();
