const { to, TE, formatDate, incrementNo } = require("../services/util.service");
const Models = require("../models/model");
const Sequelize = require("sequelize");
const dbConnection = require("../data/database/db");
const Op = Sequelize.Op;
const _ = require("lodash");
const CommonService = require("../services/common.service");
const { where } = require("sequelize");


const getDashboardDetails = async (a) => {

    let err;

    pendingOrderQuery = {
        where: {},
        attributes: [[sequelize.fn('sum', sequelize.col('Quantity')), 'pendingitems'],
        [sequelize.fn('sum', sequelize.col('Amount Including VAT')), 'pendingValue']],
        raw: true,
    }

    lowStockQuery = {
        where: {},
        attributes: [[sequelize.fn('sum', sequelize.col('Reorder Point')), 'lowStockUnit'],
        [sequelize.fn('sum', sequelize.col('Unit Price')), 'lowStockValue']],
        raw: true,
    };

    inProductionQuery = "SELECT SUM(p.[Quantity]) AS [productionUnit], SUM(i.[Unit Price]) as productionValue" +
        " FROM [" + process.env.BC_DB_NAME + "$DKM Production] as p" +
        " LEFT OUTER JOIN [" + process.env.BC_DB_NAME + "$Item] as i ON  p.[Item No_] = i.[No_]" +
        " WHERE status = 0";



    [err, dashboardPending] = await to(
        Models[process.env.BC_DB_NAME + "$Sales Line"].findAll(pendingOrderQuery)
    );

    [err, dashboardLowStock] = await to(
        Models[process.env.BC_DB_NAME + "$Item"].findAll(lowStockQuery)
    );

    let inProduction = await dbConnection.query(inProductionQuery);


    const dashboardData = { pendingOrder: dashboardPending[0], lowStockRisk: dashboardLowStock[0], inProduction: inProduction[0][0] }
    if (err) TE(err.message);
    return dashboardData;

}

const getTotalSalesByCompany = async (companySalesInfo) => {

    salesQuery = {
        attributes: [[sequelize.fn('sum', sequelize.col('Sales Amount (Actual)')), 'totalSales']],
        where: { 'Item Ledger Entry Type': 1 },
        raw: true,
    };

    // salesQuery.raw = true;
    if (companySalesInfo.keyword) {
        salesQuery.where['Posting Date'] =
        {
            [Op.like]: `%${companySalesInfo.keyword}%`
        }
    }


    let [err, dashboardSaleCompany] = await to(
        Models[process.env.BC_DB_NAME + "$Value Entry"].findAll(salesQuery)
    );


    const dashboardData = { salesByCompany: dashboardSaleCompany[0] }
    if (err) TE(err.message);
    return dashboardData;

}

const getTopCompanyBySales = async (companyInfo) => {

    comapnyQuery = "SELECT C.[Name],C.[Customer Type],C.[Customer Group], SUM(V.[Sales Amount (Actual)]) AS [totalSales] " +
        "FROM [" + process.env.BC_DB_NAME + "$Customer] AS C JOIN [" + process.env.BC_DB_NAME + "$Value Entry] as V " +
        "ON C.[No_]=V.[Source No_]" +
        "WHERE V.[Item Ledger Entry Type]=1 AND C.[Customer Group] !=''" +
        "GROUP BY V.[Source No_],C.[Name],C.[Customer Type], C.[Customer Group] ORDER BY totalSales DESC";

    let err;
    let dashboardTopCompany = await dbConnection.query(comapnyQuery);

    if (err) TE(err.message);
    return dashboardTopCompany;

}



module.exports = { getDashboardDetails, getTotalSalesByCompany, getTopCompanyBySales };