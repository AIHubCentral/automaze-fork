const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/db.sqlite',
    logging: false
});

const Item = require('./models/Item.js')(sequelize, Sequelize.DataTypes);
require('./models/User.js')(sequelize, Sequelize.DataTypes);
require('./models/UserItems.js')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({ force }).then(async () => {
    // const itemsData = require('../JSON/items.json');

    const items = [
        Item.upsert({ name: 'Banana', keyname: 'banana' }),
    ];

    await Promise.all(items);

    console.log('Database synced');

    sequelize.close();
}).catch(console.error);