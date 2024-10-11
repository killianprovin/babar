module.exports = (sequelize, DataTypes) => {

    const Deposits = sequelize.define('Deposits', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_customer: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Customers', 
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
    });

    return Deposits;
};