"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    await knex.schema.createTable('users', (table) => {
        table.string('id', 19).primary();
        table.string('username', 32).notNullable();
        table.string('display_name').defaultTo('');
        table.integer('bananas').defaultTo(0);
        table.timestamps(true, true);
    });
    await knex.schema.createTable('resources', (table) => {
        table.increments('id').primary();
        table.string('category').notNullable();
        table.string('url').notNullable();
        table.string('displayTitle');
        table.string('emoji');
        table.string('authors');
    });
    await knex.schema.createTable('collaborators', (table) => {
        table.string('id').primary();
        table.string('username').notNullable();
        table.string('displayName');
    });
    await knex.schema.createTable('settings', (table) => {
        table.string('id').primary();
        table.string('theme').notNullable().defaultTo('default');
        table.boolean('send_logs').defaultTo(false);
        table.boolean('send_automated_replies').defaultTo(false);
        table.boolean('add_reactions').defaultTo(true);
        table.boolean('delete_messages').defaultTo(true);
        table.string('debug_guild_id');
        table.string('debug_guild_channel_id');
    });
}
async function down(knex) {
    await knex.schema.dropTableIfExists('collaborators');
    await knex.schema.dropTableIfExists('resources');
    await knex.schema.dropTableIfExists('settings');
    await knex.schema.dropTableIfExists('users');
}
