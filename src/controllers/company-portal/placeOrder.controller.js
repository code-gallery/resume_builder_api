const jwt = require("jsonwebtoken");
var secretkey = "SOMESECRET";
var config = require('../../config/config')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { to, ReE, TE, ReS} = require('../../services/util.service');
const placeOrderService = require('../../services/placeOrder.service');
const OrderService = require('../../services/order.service');

const CommonService = require("./../../services/common.service");
// const getCartDetails = function (req, res) {
//     console.log("cart called");
//     var connection = mysql.createConnection(config.Local_DB_Config);
//     connection.connect((err) => {
//         console.log("Error :- ", err);
//         let query_statement = `SELECT * FROM dkmdatabase.cart;`;
//         connection.query(query_statement, (resp, data) => {
//             res.send({ msg: "cart called.......", data })
//         });
//     });
// }

const placeOrder = async (req, res) => {
    let err, orderDetails;
    let start = new Date();
    const orderInfo = req.body;
console.log(req.user);
    [err, orderDetails] = await to (placeOrderService.placeOrder(orderInfo,req.user));
    if (err) return ReE(res, err, 200);
    return ReS(res, {
      message: "Order Placed Successfully"
    }, 200, start);
}

const orderHistory = async (req, res) => {
  let err;
  let start = new Date();
  const orderInfo = req.query;

  console.log(orderInfo);
  [err, salesOrders] = await to (OrderService.getOrdersList(orderInfo));
  [error, salesInvoices] = await to (OrderService.getCompletedOrdersList(orderInfo));
 
  const pending = salesOrders.list;
  const completed = salesInvoices.list;
  const totalCount = salesOrders.totalRecords+salesInvoices.totalRecords

  const finalOrders = pending.concat(completed) ;

  if (err) return ReE(res, err, 200);
  if (error) return ReE(res, error, 200);

  paginationOutPut = await CommonService.paginationOutPut(
    finalOrders,
    salesOrders.pageNumber,
    salesOrders.pageSize,
    totalCount
  );

  return ReS(res,paginationOutPut, 200, start);
}

const orderInvoice = async (req, res) => {
  let err;
  let start = new Date();
  const orderInfo = req.query;

  if(orderInfo.is_completed == 1)
    [err, orderDetails] = await to (OrderService.getCompletedOrderInvoice(orderInfo));
  else
    [err, orderDetails] = await to (OrderService.getOrderInvoice(orderInfo));

  if (err) return ReE(res, err, 200);

  return ReS(res,orderDetails, 200, start);
}

const exchangeOrder = async(req, res) => {
  let err,orderItems;
  let start = new Date();
  const orderInfo = req.query;
  
  [err, orderItems] = await to (placeOrderService.exchangeOrderItems(orderInfo));
  

  if (err) return ReE(res, err, 200);

  return ReS(res,orderItems, 200, start);
}

const save = async(req, res) => {
  let err,orderItems;
  let start = new Date();
  [err, orderItems] = await to (placeOrderService.save(req.body,req.user));
  
  if (err) return ReE(res, err, 200);

  return ReS(res,orderItems, 200, start);
}


module.exports = { placeOrder,orderHistory,orderInvoice,exchangeOrder,save };




