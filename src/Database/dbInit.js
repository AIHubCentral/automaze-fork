/* Initialize knex database and create tables */

const path = require('node:path');
const fs = require('node:fs').promises;

async function checkFileExists(filePath) {
    try {
        await fs.access(filePath, fs.constants.F_OK);
        return true;
    } catch (error) {
        return false;
    }
}

const SQLITE_PATH = path.join(process.cwd(), 'database', 'knex.sqlite');

(async () => {
    const fileExists = await checkFileExists(SQLITE_PATH);

    if (fileExists) {
        console.error(`Database "${SQLITE_PATH}" already exists, delete it to create a new one.`);
    } else {
        console.log(`Creating database: ${SQLITE_PATH}`);

        const knexInstance = require(path.join(process.cwd(), 'database', 'dbManager.js')).createInstance(
            SQLITE_PATH
        );

        try {
            await knexInstance.schema.createTable('user', (table) => {
                table.string('id', 19).primary();
                table.string('username', 32).notNullable();
                table.string('display_name');
                table.integer('bananas').defaultTo(0);
                table.timestamps(true, true);
            });

            console.log('Database created!');
        } catch (error) {
            console.error('Failed to create tables', error);
        } finally {
            await knexInstance.destroy();
        }
    }
})();
