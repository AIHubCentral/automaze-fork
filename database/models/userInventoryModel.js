const { DataTypes } = require('sequelize');

// junction table for user and inventory
const userInventoryModel = {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    userId: {
        type: DataTypes.STRING(19),
        allowNull: false,
        references: {
            model: 'User',
            key: 'discord_id' // This is the column name of the referenced model
        }
    },
    itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Item',
            key: 'id'
        }
    },

};

module.exports = { userInventoryModel };