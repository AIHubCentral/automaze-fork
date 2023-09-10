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
    }
};

module.exports = { itemModel };