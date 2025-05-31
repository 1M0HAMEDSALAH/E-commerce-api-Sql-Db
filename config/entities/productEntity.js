module.exports = (sequelize, DataTypes) => {
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'products',
        timestamps: true, // يدير createdAt و updatedAt تلقائيًا
    });

    return Product;
};
  