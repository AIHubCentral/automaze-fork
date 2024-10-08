import Knex from 'knex';
import path from 'path';

function createInstance(sqliteFilePath: string) {
    /* returns a knex instance */
    const knexConfig = {
        client: 'sqlite3',
        connection: {
            filename: sqliteFilePath,
        },
        useNullAsDefault: true,
    };
    const knex = Knex(knexConfig);
    return knex;
}

async function exportData(knex: Knex.Knex) {
    /* exports data from database */
    const users = await knex('user').select('*');
    const items = await knex('item').select('*');
    const inventory = await knex('inventory').select('*');
    return { users, items, inventory };
}

async function importData(knex: Knex.Knex, data: any) {
    /* imports data to database */
    await knex('user').insert(data.users);
    await knex('item').insert(data.items);
    await knex('inventory').insert(data.inventory);
    console.log('Data imported!');
}

const RESOURCES_DATABASE_PATH = path.join(process.cwd(), 'database', 'resources.sqlite');

const resourcesDatabase = Knex({
    client: 'sqlite3',
    connection: {
        filename: RESOURCES_DATABASE_PATH,
    },
    useNullAsDefault: true,
});

export { createInstance, exportData, importData, RESOURCES_DATABASE_PATH, resourcesDatabase };
