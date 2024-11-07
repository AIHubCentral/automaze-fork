"use strict";
/* Initialize knex database and create tables */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db_1 = __importDefault(require("../db"));
const fileUtilities_1 = require("../Utils/fileUtilities");
const knexfile_1 = require("./knexfile");
(async () => {
    const environment = process.env.NODE_ENV || 'development';
    console.log('Estabilishing connection...');
    // Use SQLite on development env
    if (environment === 'development') {
        const databaseFileExists = await (0, fileUtilities_1.fileExists)(knexfile_1.DATABASE_PATH);
        if (databaseFileExists) {
            console.log(`${knexfile_1.DATABASE_PATH} already exists...Skipping`);
            return;
        }
    }
    try {
        await db_1.default.migrate.latest();
        await db_1.default.seed.run();
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
