// db/dbContext.js
const { Sequelize } = require('sequelize');
const ResisterModel = require('../entities/registerEntity');
const ReportModel = require('../entities/reportsEntity');
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST || 'localhost',
  dialect: 'mysql', // أو أي Dialect تستخدمه
});

const registerDb = {
  sequelize,
  Sequelize,
  Resister: ResisterModel(sequelize, Sequelize.DataTypes),
  Report: ReportModel(sequelize, Sequelize.DataTypes),
};

module.exports = registerDb;
