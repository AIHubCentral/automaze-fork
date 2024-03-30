function createInstance(sqliteFilePath) {
    /* returns a knex instance */
    const knex = require('knex')({
        client: 'sqlite3',
        connection: {
            filename: sqliteFilePath,
        },
        useNullAsDefault: true,
    });
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

module.exports = { createInstance, exportData, importData };