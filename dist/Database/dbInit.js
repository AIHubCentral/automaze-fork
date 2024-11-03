"use strict";
/* Initialize knex database and create tables */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const promises_1 = require("fs/promises");
const fs_1 = require("fs");
const node_path_1 = __importDefault(require("node:path"));
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
class DatabaseInitializer {
    environment;
    knexInstance = null;
    constructor(environment) {
        this.environment = environment;
    }
    async createConnection() {
        console.log('Estabilishing connection...');
        let dbConfig = {};
        if (this.environment === 'production') {
            dbConfig = {
                client: 'mysql2',
                connection: {
                    host: process.env.DB_HOST,
                    port: Number(process.env.DB_PORT),
                    user: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_NAME,
                },
                pool: { min: 2, max: 10 },
            };
        }
        else {
            const RESOURCES_DATABASE_PATH = node_path_1.default.join(process.cwd(), 'database', 'resources.sqlite');
            const databaseFileExists = await fileExists(RESOURCES_DATABASE_PATH);
            if (databaseFileExists) {
                console.log(`${RESOURCES_DATABASE_PATH} already exists...Skipping`);
                return;
            }
            dbConfig = {
                client: 'sqlite3',
                connection: {
                    filename: RESOURCES_DATABASE_PATH,
                },
                useNullAsDefault: true,
            };
        }
        try {
            this.knexInstance = (0, knex_1.default)(dbConfig);
            console.log('Database connection initialized successfully.');
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Failed to initialize the database connection:', error.message);
            }
            else {
                console.error('Unknown error occurred during database initialization.');
            }
        }
    }
    async createTables() {
        if (!this.knexInstance)
            return;
        try {
            await this.knexInstance.schema.createTable('user', (table) => {
                table.string('id', 19).primary();
                table.string('username', 32).notNullable();
                table.string('display_name');
                table.integer('bananas').defaultTo(0);
                table.timestamps(true, true);
            });
            await this.knexInstance.schema.createTable('resources', (table) => {
                table.increments('id').primary();
                table.string('category').notNullable();
                table.string('url').notNullable();
                table.string('displayTitle');
                table.string('emoji');
                table.string('authors');
            });
            await this.knexInstance.schema.createTable('collaborators', (table) => {
                table.string('discordId').primary();
                table.string('username').notNullable();
                table.string('displayName');
            });
            await this.knexInstance.schema.createTable('settings', (table) => {
                table.increments('id').primary();
                table.string('debug_guild_id');
                table.string('debug_guild_channel_id');
                table.boolean('send_logs');
                table.boolean('send_automated_messages');
            });
            console.log('Database created!');
        }
        catch (error) {
            console.error('Failed to create tables', error);
        }
    }
    async destroyConnection() {
        if (this.knexInstance) {
            await this.knexInstance.destroy();
            console.log('Connection closed');
        }
    }
}
(async () => {
    const initializer = new DatabaseInitializer(process.env.NODE_ENV || 'development');
    await initializer.createConnection();
    await initializer.createTables();
    await initializer.destroyConnection();
})();
