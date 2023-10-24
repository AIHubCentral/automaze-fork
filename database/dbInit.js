const dbManager = require('./dbManager.js');
const knex = dbManager.createInstance('./database/knex.sqlite');
const items = require('../JSON/items.json');

(async () => {
	// create tables
	await knex.schema.createTable('user', function(table) {
		table.string('id', 19).primary();
		table.string('username', 32).notNullable();
		table.integer('exp');
		table.integer('credits');
		table.boolean('banana_disabled');
	});

	await knex.schema.createTable('item', function(table) {
		table.integer('id').primary();
		table.string('name', 128).unique().notNullable();
		table.integer('worth');
		table.boolean('equipable');
		table.string('item_type', 64);
	});

	await knex.schema.createTable('inventory', function(table) {
		table.integer('quantity').notNullable();
		table.string('user_id', 19).notNullable().references('id').inTable('user');
		table.integer('item_id').unsigned().notNullable().references('id').inTable('item');
		table.primary(['user_id', 'item_id']);
	});

	// insert initial data
	for (let key in items) {
		let itemSimplified = {
			id: items[key].id,
			name: items[key].name,
			worth: items[key].worth ?? 0,
			equipable: items[key].equipable ?? false,
			'item_type': items[key].type ?? 'N/A'
		};
		await knex('item').insert(itemSimplified);
		console.log(`Item ${itemSimplified.name} (${itemSimplified.id}) inserted`);
	}

	await knex.destroy();
	console.log('Database created!');
})();