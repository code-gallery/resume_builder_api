const inventoryService = require("../../services/inventory.service");
const { to, ReE, TE, ReS } = require("../../services/util.service");


const getInventories = async function (req, res) {
  let err;
  let start = new Date();
  const inventory = req.query;
  [err, inventories] = await to(inventoryService.getInventorySOH(inventory));
  if (err) return ReE(res, err, 200);
  return ReS(
    res, inventories,200,start);
};

const getLowStocks = async function (req, res) {
  let err;
  let start = new Date();
  const inventory = req.query;
  [err, inventories] = await to(inventoryService.getLowStocks(inventory));
  if (err) return ReE(res, err, 200);
  return ReS(
    res, inventories,200,start);
};

const getInProduction = async function (req, res) {
 
  let err;
  let start = new Date();
  const inventory = req.query;
  console.log(inventory);
  [err, inventories] = await to(inventoryService.getInProduction(inventory));
  if (err) return ReE(res, err, 200);
  return ReS(
    res, inventories,200,start);
};

const dashboardList = async function (req, res) {

  let err;
  let start = new Date();
  
  [err, dashboard] = await to(inventoryService.getDashboardDetails());
  if (err) return ReE(res, err, 200);

  return ReS(res, dashboard, 200, start);
};



module.exports = { getInventories,getInProduction,getLowStocks, dashboardList };
