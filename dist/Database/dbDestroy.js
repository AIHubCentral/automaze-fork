"use strict";
/**
 * Roll back the last migration and destroy the tables / database
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const node_path_1 = __importDefault(require("node:path"));
const db_1 = __importDefault(require("../db"));
const fileUtilities_1 = require("../Utils/fileUtilities");
(async () => {
    const environment = process.env.NODE_ENV || 'development';
    // Use SQLite on development env
    if (environment === 'development') {
        const RESOURCES_DATABASE_PATH = node_path_1.default.join(process.cwd(), 'database', 'resources.sqlite');
        const successfullyDeleted = await (0, fileUtilities_1.deleteFileIfExists)(RESOURCES_DATABASE_PATH);
        if (successfullyDeleted) {
            console.log(`${RESOURCES_DATABASE_PATH} successfully removed`);
        }
        return;
    }
    console.log('Estabilishing connection...');
    try {
        await db_1.default.migrate.rollback();
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
