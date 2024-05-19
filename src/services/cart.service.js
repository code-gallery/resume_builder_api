const { to, TE } = require("../services/util.service");
const Models = require("../models/model");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { query } = require("express");
const { forEach } = require("lodash");
const dbConnection = require("../data/database/db");
const { TEXT, Model } = require("sequelize");
const _ = require("lodash");
const CommonService = require("../services/common.service");
const db = require("../models/model");


const createCartSummary = async (cartInfo) => {

  let finditem = await Models.cart_items.findOne({
    where: { item_code: cartInfo[0].item_code },
    raw: true
  });
  console.log(finditem)
  if (finditem) TE("Product Already in Cart");
  return await Models.cart_items.bulkCreate(cartInfo);
};

const updateCartSummary = async (cartInfo) => {
  for (let i = 0; i < cartInfo.length; i++) {
    var finditem = await Models.cart_items.findOne({
      where: { item_code: cartInfo[i].item_code },
      raw: true
    });
  }
  if (_.isEmpty(finditem)) TE("Product Not Found");

  for (let i = 0; i < cartInfo.length; i++) {
    await Models.cart_items.update(cartInfo[i], { where: { cart_id: cartInfo[i].cart_id } });
  }
  return;
};

const deleteCartSummary = async (cartInfo) => {
  return await Models.cart_items.destroy({ where: { cart_id: cartInfo[0].cart_id } });
};

const deleteAllCartSummary = async (cartInfo) => {
  return await Models.cart_items.destroy({ where: { customer_no: cartInfo.customer_no } });
};

const getCartDetails = async (cartDetails) => {
  let [err, cart] = await to(Models.cart_items.findAndCountAll(cartDetails));
  if (err) TE(err.message);
  return cart.rows;
};

const applyStoreCredit = async (cartDetails) => {

}

module.exports = { createCartSummary, updateCartSummary, deleteCartSummary, getCartDetails, deleteAllCartSummary };
