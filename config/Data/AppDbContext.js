const { Sequelize } = require('sequelize');
const ResisterModel = require('../entities/userEntity');
const ReportModel = require('../entities/reportsEntity');
const ProductModel = require('../entities/productEntity');
const ProductImageModel = require('../entities/productImageEntity');
const OrderModel = require('../entities/orderEntity'); // ✅ أضف هذا السطر

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST || 'localhost',
  dialect: 'mysql',
});

const registerDb = {
  sequelize,
  Sequelize,
  Resister: ResisterModel(sequelize, Sequelize.DataTypes),
  Report: ReportModel(sequelize, Sequelize.DataTypes),
  Product: ProductModel(sequelize, Sequelize.DataTypes),
  ProductImage: ProductImageModel(sequelize, Sequelize.DataTypes),
  Order: OrderModel(sequelize, Sequelize.DataTypes), // ✅ أضف هذا السطر
};

// علاقات المنتجات
registerDb.Product.hasMany(registerDb.ProductImage, { foreignKey: 'productId', as: 'images' });
registerDb.ProductImage.belongsTo(registerDb.Product, { foreignKey: 'productId' });

// علاقة الطلبات بالمستخدم
registerDb.Resister.hasMany(registerDb.Order, { foreignKey: 'userId', as: 'orders' });
registerDb.Order.belongsTo(registerDb.Resister, { foreignKey: 'userId' }); // ✅

module.exports = registerDb;
