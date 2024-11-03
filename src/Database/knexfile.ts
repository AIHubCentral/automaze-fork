import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

const RESOURCES_DATABASE_PATH = path.join(process.cwd(), 'database', 'resources.sqlite');

const knexConfig = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: RESOURCES_DATABASE_PATH,
        },
        useNullAsDefault: true,
        migrations: {
            directory: path.join(__dirname, 'migrations'),
        },
        seeds: {
            directory: path.join(__dirname, 'seeds'),
        },
    },
    test: {
        client: 'sqlite3',
        connection: {
            filename: ':memory:',
        },
        useNullAsDefault: true,
        migrations: {
            directory: path.join(__dirname, 'migrations'),
        },
        seeds: {
            directory: path.join(__dirname, 'seeds'),
        },
    },
    production: {
        client: 'mysql2',
        connection: {
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        },
        pool: { min: 2, max: 10 },
        migrations: {
            directory: path.join(__dirname, 'migrations'),
        },
        seeds: {
            directory: path.join(__dirname, 'seeds'),
        },
    },
};

export type Environment = keyof typeof knexConfig;

export default knexConfig;
