/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('item', function(table) {
        table.integer('id').primary();
        table.string('name', 128).unique().notNullable();
        table.integer('worth');
        table.boolean('equipable');
        table.string('item_type', 64);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('item');
};
