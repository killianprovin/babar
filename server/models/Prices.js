module.exports = (sequelize, DataTypes) => {

    const Prices = sequelize.define('Prices', {
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
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
    });

    return Prices;
};