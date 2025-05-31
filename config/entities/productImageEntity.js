// entities/productImage.js
module.exports = (sequelize, DataTypes) => {
    const ProductImage = sequelize.define('ProductImage', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'product_images',
        timestamps: false,
    });

    ProductImage.associate = (models) => {
        ProductImage.belongsTo(models.Product, { foreignKey: 'productId' });
    };

    return ProductImage;
};
  