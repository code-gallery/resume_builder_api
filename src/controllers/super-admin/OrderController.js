const orderService = require("../../services/order.service");
const { to, ReE, TE, ReS} = require('../../services/util.service');


const getPendingOrders = async function (req, res) {

    let err, orders;
    let start = new Date();
    const salesOrder = req.query;

    [err, orders] = await to(orderService.getOrdersList(salesOrder));
    if (err) return ReE(res, err, 200);

    return ReS(res, 
       orders
    , 200, start);
  };

  const getCompletedOrders = async function (req, res) {

    let err, orders;
    let start = new Date();
    const salesOrder = req.query;

    [err, orders] = await to(orderService.getCompletedOrdersList(salesOrder));
    if (err) return ReE(res, err, 200);

    return ReS(res, 
       orders
    , 200, start);
  };

  const getWithWarehouseOrders = async function (req, res) {

    let err, order;
    let start = new Date();
    const salesOrder = req.query;

    [err, order] = await to(orderService.getOrdersList(salesOrder));
    if (err) return ReE(res, err, 200);

    return ReS(res,order, 200, start);
  };

  const getOrderDetail = async function (req, res) {

    let err, order;
    let start = new Date();

    [err, order] = await to(orderService.getOrderDetail(req.query));
    if (err) return ReE(res, err, 200);

    return ReS(res,order, 200, start);
  };

  const getCompletedOrderDetail = async function (req, res) {

    let err, order;
    let start = new Date();

    [err, order] = await to(orderService.getCompletedOrderDetail(req.query));
    if (err) return ReE(res, err, 200);

    return ReS(res,order, 200, start);
  };

  const getOrderInvoice = async function (req, res) {

    let err, order;
    let start = new Date();

    [err, order] = await to(orderService.getOrderInvoice(req.query));
    if (err) return ReE(res, err, 200);

    return ReS(res,order, 200, start);
  };

  const getCompletedOrderInvoice = async function (req, res) {

    let err, order;
    let start = new Date();

    [err, order] = await to(orderService.getCompletedOrderInvoice(req.query));
    if (err) return ReE(res, err, 200);

    return ReS(res,order, 200, start);
  };

  const getExchangeRequests = async function (req, res) {
    let err, order;
    let start = new Date();

    [err, order] = await to(orderService.getExchangeRequests(req.query));
    if (err) return ReE(res, err, 200);

    return ReS(res,order, 200, start);
  }

  const getExchangeOrderDetail = async function (req, res) {
    let err, order;
    let start = new Date();

    [err, order] = await to(orderService.getExchangeOrderDetail(req.query));
    if (err) return ReE(res, err, 200);

    return ReS(res,order, 200, start);
  }

  const approveExchangeOrder = async function (req, res) {
    let err, order;
    let start = new Date();


    [err, order] = await to(orderService.approveExchangeOrder(req.body,req.user));

    if (err) return ReE(res, err, 200);

    return ReS(res,order, 200, start);
  }

  const getCompletedOrdersCount = async function (req, res) {
    let err, order;
    let start = new Date();


    [err, order] = await to(orderService.getCompletedOrdersCount(req.body,req.user));

    if (err) return ReE(res, err, 200);

    return ReS(res,order, 200, start);
  }
  

  module.exports = { getPendingOrders,getCompletedOrders,getWithWarehouseOrders,getOrderDetail,getOrderInvoice, getCompletedOrderDetail,
    getCompletedOrderInvoice,getExchangeRequests,getExchangeOrderDetail,approveExchangeOrder,getCompletedOrdersCount }