"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resourcesDatabase = exports.RESOURCES_DATABASE_PATH = void 0;
exports.createInstance = createInstance;
exports.exportData = exportData;
exports.importData = importData;
const knex_1 = __importDefault(require("knex"));
const path_1 = __importDefault(require("path"));
function createInstance(sqliteFilePath) {
    /* returns a knex instance */
    const knexConfig = {
        client: 'sqlite3',
        connection: {
            filename: sqliteFilePath,
        },
        useNullAsDefault: true,
    };
    const knex = (0, knex_1.default)(knexConfig);
    return knex;
}
async function exportData(knex) {
    /* exports data from database */
    const users = await knex('user').select('*');
    const items = await knex('item').select('*');
    const inventory = await knex('inventory').select('*');
    return { users, items, inventory };
}
async function importData(knex, data) {
    /* imports data to database */
    await knex('user').insert(data.users);
    await knex('item').insert(data.items);
    await knex('inventory').insert(data.inventory);
    console.log('Data imported!');
}
const RESOURCES_DATABASE_PATH = path_1.default.join(process.cwd(), 'database', 'resources.sqlite');
exports.RESOURCES_DATABASE_PATH = RESOURCES_DATABASE_PATH;
const resourcesDatabase = (0, knex_1.default)({
    client: 'sqlite3',
    connection: {
        filename: RESOURCES_DATABASE_PATH,
    },
    useNullAsDefault: true,
});
exports.resourcesDatabase = resourcesDatabase;
