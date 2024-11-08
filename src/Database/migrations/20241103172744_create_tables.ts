import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
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

    await knex.schema.createTable('models', (table) => {
        table.string('id', 20).primary();
        table.string('parent_id', 20).notNullable();
        table.string('author_id', 20).notNullable();
        table.string('title', 100).notNullable();
        table.boolean('is_request').notNullable();
        table.text('description');
    });

    await knex.schema.createTable('weights_models', (table) => {
        table.string('id', 32).primary();
        table.string('url', 255).unique();
        table.string('image_url', 255).notNullable();
        table.string('title', 100).notNullable();
        table.text('description');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('collaborators');
    await knex.schema.dropTableIfExists('resources');
    await knex.schema.dropTableIfExists('settings');
    await knex.schema.dropTableIfExists('users');
    await knex.schema.dropTableIfExists('models');
    await knex.schema.dropTableIfExists('weights_models');
}
