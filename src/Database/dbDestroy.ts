/**
 * Roll back the last migration and destroy the tables / database
 */

import dotenv from 'dotenv';
dotenv.config();

import path from 'node:path';

import knexInstance from '../db';
import { deleteFileIfExists } from '../Utils/fileUtilities';

(async () => {
    const environment = process.env.NODE_ENV || 'development';

    // Use SQLite on development env
    if (environment === 'development') {
        const RESOURCES_DATABASE_PATH = path.join(process.cwd(), 'database', 'resources.sqlite');

        const successfullyDeleted = await deleteFileIfExists(RESOURCES_DATABASE_PATH);

        if (successfullyDeleted) {
            console.log(`${RESOURCES_DATABASE_PATH} successfully removed`);
        }

        return;
    }

    console.log('Estabilishing connection...');

    try {
        await knexInstance.migrate.rollback();
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
