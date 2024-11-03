"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const RESOURCES_DATABASE_PATH = path_1.default.join(process.cwd(), 'database', 'resources.sqlite');
const knexConfig = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: RESOURCES_DATABASE_PATH,
        },
        useNullAsDefault: true,
        migrations: {
            directory: path_1.default.join(__dirname, 'migrations'),
        },
        seeds: {
            directory: path_1.default.join(__dirname, 'seeds'),
        },
    },
    test: {
        client: 'sqlite3',
        connection: {
            filename: ':memory:',
        },
        useNullAsDefault: true,
        migrations: {
            directory: path_1.default.join(__dirname, 'migrations'),
        },
        seeds: {
            directory: path_1.default.join(__dirname, 'seeds'),
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
            directory: path_1.default.join(__dirname, 'migrations'),
        },
        seeds: {
            directory: path_1.default.join(__dirname, 'seeds'),
        },
    },
};
exports.default = knexConfig;
