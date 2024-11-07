/**
 * Roll back the last migration and destroy the tables / database
 */

import dotenv from 'dotenv';
dotenv.config();

import knexInstance from '../db';
import { deleteFileIfExists } from '../Utils/fileUtilities';
import { DATABASE_PATH } from './knexfile';

(async () => {
    const environment = process.env.NODE_ENV || 'development';

    // Use SQLite on development env
    if (environment === 'development') {
        const successfullyDeleted = await deleteFileIfExists(DATABASE_PATH);

        if (successfullyDeleted) {
            console.log(`${DATABASE_PATH} successfully removed`);
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
