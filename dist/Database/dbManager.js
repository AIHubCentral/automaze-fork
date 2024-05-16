"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importData = exports.exportData = exports.createInstance = void 0;
const knex_1 = __importDefault(require("knex"));
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
exports.createInstance = createInstance;
async function exportData(knex) {
    /* exports data from database */
    const users = await knex('user').select('*');
    const items = await knex('item').select('*');
    const inventory = await knex('inventory').select('*');
    return { users, items, inventory };
}
exports.exportData = exportData;
async function importData(knex, data) {
    /* imports data to database */
    await knex('user').insert(data.users);
    await knex('item').insert(data.items);
    await knex('inventory').insert(data.inventory);
    console.log('Data imported!');
}
exports.importData = importData;
