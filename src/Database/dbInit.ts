/* Initialize knex database and create tables */

import dotenv from 'dotenv';
dotenv.config();

import { access } from 'fs/promises';
import { constants } from 'fs';
import path from 'node:path';

import knexInstance from '../db';

/**
 * Checks if a file exists at the given path.
 * @param filePath - The path to the file to check.
 * @returns A boolean indicating if the file exists.
 */
async function fileExists(filePath: string): Promise<boolean> {
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

(async () => {
    const environment = process.env.NODE_ENV || 'development';

    console.log('Estabilishing connection...');

    // Use SQLite on development env
    if (environment === 'development') {
        const RESOURCES_DATABASE_PATH = path.join(process.cwd(), 'database', 'resources.sqlite');

        const databaseFileExists = await fileExists(RESOURCES_DATABASE_PATH);

        if (databaseFileExists) {
            console.log(`${RESOURCES_DATABASE_PATH} already exists...Skipping`);
            return;
        }
    }

    try {
        await knexInstance.migrate.latest();
        console.log('Migration run successfully.');
    } catch (error) {
        if (error instanceof Error) {
            console.error('Failed to run migrations', error.message);
        } else {
            console.error('Unknown error occurred during database initialization.');
        }
    } finally {
        await knexInstance.destroy();
        console.log('Connection closed');
    }
})();
