const dashboardService = require("../../services/dashboard.service");
const { to, ReE, TE, ReS } = require('../../services/util.service');

const dashboardDetails = async function (req, res) {

  let err;
  let start = new Date();

  [err, dashboard] = await to(dashboardService.getDashboardDetails());
  if (err) return ReE(res, err, 200);

  return ReS(res, dashboard, 200, start);
};

const companySaleDetails = async function (req, res) {

  let err, companyTotalSale;
  let start = new Date();
  const companySalesInfo = req.body;

  [err, companyTotalSale] = await to(dashboardService.getTotalSalesByCompany(companySalesInfo));
  if (err) return ReE(res, err, 200);

  return ReS(res, companyTotalSale, 200, start);
};

const topCompanyDetails = async function (req, res) {

  let err, topCompany;
  let start = new Date();
  const companyInfo = req.body;

  [err, topCompany] = await to(dashboardService.getTopCompanyBySales(companyInfo));
  if (err) return ReE(res, err, 200);

  return ReS(res, topCompany, 200, start);
};

module.exports = { dashboardDetails, companySaleDetails, topCompanyDetails };