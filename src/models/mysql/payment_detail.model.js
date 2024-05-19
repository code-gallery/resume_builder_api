const bcrypt = require('bcrypt');
const { to, TE,ReE, readHTMLFile } = require('../../services/util.service');


module.exports = (sequelize, DataTypes) => {
    const payment_details = sequelize.define("payment_details",{
        id: {
          allowNull: false,
          autoIncrement: true,
          unique: true,
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        user_id: {
          allowNull: true,
          unique: true,
          type: DataTypes.INTEGER,
        },
        customer_no: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        order_amount: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        updatedAt	: {
          allowNull: true,
          type: DataTypes.DATE,
        },
        restext: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        refid: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        summarycode: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        rescode: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        txnid: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        createdAt	: {
          allowNull: true,
          type: DataTypes.STRING,
        }
      },
    );
    payment_details.associate = function (models) {
     
    };
  
    return payment_details;
  };
  