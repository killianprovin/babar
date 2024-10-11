module.exports = (sequelize, DataTypes) => {

    const Customers = sequelize.define('Customers', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        nickname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        barman: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        status:{
            type: DataTypes.STRING,
            allowNull: true
        },
    });

    return Customers;
};
