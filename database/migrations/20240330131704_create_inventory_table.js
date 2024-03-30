/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    // junction table for user and item
    return knex.schema.createTable('inventory', function(table) {
        table.integer('quantity').notNullable();
        table.string('user_id', 19).notNullable().references('id').inTable('user');
        table.integer('item_id').unsigned().notNullable().references('id').inTable('item');
        table.primary(['user_id', 'item_id']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('inventory');
};
