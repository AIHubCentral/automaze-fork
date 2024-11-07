/* Initialize knex database and create tables */

import dotenv from 'dotenv';
dotenv.config();

import knexInstance from '../db';
import { fileExists } from '../Utils/fileUtilities';
import { DATABASE_PATH } from './knexfile';

(async () => {
    const environment = process.env.NODE_ENV || 'development';

    console.log('Estabilishing connection...');

    // Use SQLite on development env
    if (environment === 'development') {
        const databaseFileExists = await fileExists(DATABASE_PATH);

        if (databaseFileExists) {
            console.log(`${DATABASE_PATH} already exists...Skipping`);
            return;
        }
    }

    try {
        await knexInstance.migrate.latest();
        await knexInstance.seed.run();
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
