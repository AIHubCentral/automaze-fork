const { DataTypes } = require('sequelize');

const itemModel = {
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
};

module.exports = { itemModel };