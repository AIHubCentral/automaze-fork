const items = require('../../JSON/items.json');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('user').del();
    await knex('item').del();
    await knex('inventory').del();

    for (const key in items) {
        const itemSimplified = {
            id: items[key].id,
            name: items[key].name,
            worth: items[key].worth ?? 0,
            equipable: items[key].equipable ?? false,
            'item_type': items[key].type ?? 'N/A',
        };
        await knex('item').insert(itemSimplified);
        console.log(`Item ${itemSimplified.name} (${itemSimplified.id}) inserted`);
    }
};
