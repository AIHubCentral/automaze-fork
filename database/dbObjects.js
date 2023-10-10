const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/db.sqlite',
    logging: false
});

const User = require('./models/User.js')(sequelize, Sequelize.DataTypes);
const Item = require('./models/Item.js')(sequelize, Sequelize.DataTypes);
const UserItems = require('./models/UserItems.js')(sequelize, Sequelize.DataTypes);

// create associations
User.belongsToMany(Item, { through: UserItems });
Item.belongsToMany(User, { through: UserItems });

// attach models to sequelize instance
sequelize.User = User;
sequelize.Item = Item;
sequelize.UserInventory = UserItems;

module.exports = { sequelize };