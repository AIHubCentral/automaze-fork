/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: './database/dev.sqlite3',
        },
        migrations: {
            directory: './database/migrations',
        },
        seeds: {
            directory: './database/seeds',
        },
        useNullAsDefault: true,
        debug: false,
    },
    production: {
        client: 'sqlite3',
        connection: {
            filename: './database/prod.sqlite3',
        },
        migrations: {
            directory: './database/migrations',
        },
        seeds: {
            directory: './database/seeds',
        },
        useNullAsDefault: true,
    },
};
