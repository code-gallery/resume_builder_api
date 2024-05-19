const orderService = require("../../services/order.service");
const Models = require('../../models/model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { to, ReE, TE, ReS} = require('../../services/util.service');
const { query } = require('winston');
const { sequelize } = require("../../models/model");



const getPurchaseLocations = async function (req, res) {

  let err, order;
  let start = new Date();
  const salesOrder = req.query;
  console.log("salesOrder",salesOrder);
  [err, order] = await to(orderService.getOrdersList(salesOrder));
  if (err) return ReE(res, err, 200);
  console.log(order);
  return ReS(res, {
    message: "Successful",
    response: order
  }, 200, start);
};


module.exports = {getPurchaseLocations};
