const { Sequelize, DataTypes } = require('sequelize');
const { userModel, itemModel, userInventoryModel } = require('../models/userModel.js');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/db.sqlite'
});

(async () => {
    try {
        // this will create the database if it doesn't exist
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // create models
        const User = sequelize.define('User', userModel);
        const Item = sequelize.define('Item', itemModel);
        const UserInventory = sequelize.define('Inventory', userInventoryModel);
        
        // create model associations
        User.belongsToMany(Item, { through: UserInventory });
        Item.belongsToMany(User, { through: UserInventory });

        // sync the models
        await sequelize.sync({ force: true });
        console.log("All models were synchronized successfully.");

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    await sequelize.close();
    console.log('Connection closed.')
})();