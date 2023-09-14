const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/db.sqlite',
    logging: false
});

// create models
const User = sequelize.define('User', {
    discordId: {
        type: DataTypes.STRING(19),
        allowNull: false,
        primaryKey: true
    },
    userName: {
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: true
    },
    exp: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    credits: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    bananaDisabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

const Item = sequelize.define('Item', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true
    },
    keyName: {
        type: DataTypes.STRING,
        unique: true
    },
    worth: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    equipable: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    itemType: {
        type: DataTypes.STRING,
        defaultValue: 'N/A'
    }
});

const UserInventory = sequelize.define('Inventory', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
});

// create model associations
User.belongsToMany(Item, { through: UserInventory });
Item.belongsToMany(User, { through: UserInventory });

// attach models to sequelize instance
sequelize.User = User;
sequelize.Item = Item;
sequelize.UserInventory = UserInventory;

module.exports = { sequelize };