module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Inventory', {
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    });
};