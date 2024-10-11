module.exports = (sequelize, DataTypes) => {

    const Items = sequelize.define('Items', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return Items;
};
