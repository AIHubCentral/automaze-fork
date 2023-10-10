module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
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
};