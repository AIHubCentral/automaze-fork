const { DataTypes } = require('sequelize');

const userModel = {
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
};

module.exports = { userModel };