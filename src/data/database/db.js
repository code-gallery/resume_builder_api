const { request } = require('express');
require("dotenv").config();

const Sequelize = require("sequelize");
let sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mssql",
  operatorAliases: false,
});

module.exports = sequelize;
global.sequelize = sequelize;

