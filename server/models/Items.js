module.exports = (sequelize, DataTypes) => {

    const Items = sequelize.define('Items', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        id_category:{
            type:DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Categories', 
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return Items;
};
