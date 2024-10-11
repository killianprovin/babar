module.exports = (sequelize, DataTypes) => {
    const Purchases = sequelize.define('Purchases', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_item: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Items', 
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
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
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
    });

    return Purchases;
};