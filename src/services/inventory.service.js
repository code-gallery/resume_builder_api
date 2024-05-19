const { to, TE } = require("./util.service");
const Models = require("../models/model");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const dbConnection = require("../data/database/db");
const _ = require("lodash");
const CommonService = require("./common.service");


const getInventorySOH = async (inventory) => {
  let limit = 10;

  inventoryQuery = {
    where: { 'type': 0 },
    raw: true,
    attributes:{
      include:[
        [
          Sequelize.literal(`(select sum([Quantity]) as quantity FROM [dbo].[`+process.env.BC_DB_NAME+`$Item Ledger Entry]  as il
           WHERE il.[Item No_]=[`+process.env.BC_DB_NAME + `$Item].[No_] GROUP BY [Item No_]) `),
          'soh'
        ]
      ]
    },
    include: {
      model: Models[process.env.BC_DB_NAME + '$Item Attributes'],
      attributes:['Item Attribute Name',
        [ Sequelize.fn("concat", process.env.APP_URL+"/resources/uploads/items/",Sequelize.col("Attribute Image")),'product_image']
      ],
      required: false
    }
  };

  inventoryQuery.limit = limit;
  // if (_.isEmpty(inventory)) TE("Params are not set");
  let page = inventory.pageNumber != 0 ? inventory.pageNumber : 1;
  inventoryQuery.offset = (page - 1) * limit;
  inventoryQuery.raw = true;

  let [err, items] = await to(
    Models[process.env.BC_DB_NAME + '$Item'].findAndCountAll(inventoryQuery)
  );

  if (err) TE(err.message);

  paginationOutPut = await CommonService.paginationOutPut(
    items.rows,
    page,
    limit,
    items.count
  );
  return paginationOutPut;
};

const getInProduction = async (inventory) => {
  let limit = 10;

  let [err, count] = await to(
    Models[process.env.BC_DB_NAME + '$DKM Production'].count()
  );
  if (err) TE(err.message);


  let page = inventory.pageNumber != 0 ? inventory.pageNumber : 1;

  let inProductionQuery =  " SELECT SUM(p.[Quantity]) AS [productionUnits],p.[Variant No_] as size,p.[Item NO_],MAX(p.[Date In Production]) as production_date,"+
  " (select sum([Quantity]) as quantity FROM [dbo].[DKMTEST16Dec19$Item Ledger Entry]  as il "+
     " WHERE il.[Item No_]=p.[Item No_] AND il.[Variant Code] = p.[Variant No_] "+
   " ) AS soh,"+
   " ("+
       " SELECT i.Description FROM [DKMTEST16Dec19$Item] as i "+
       " LEFT OUTER JOIN [DKMTEST16Dec19$Item Attributes] as ia ON  ia.[Item No_] = i.[No_]"+
       " WHERE i.[No_] = p.[Item No_]"+ 
   
   " ) as item_name,"+
   " ("+
        " SELECT IA.[Item Attribute Name] FROM [DKMTEST16Dec19$Item Attributes] as IA"+
        " WHERE IA.[Item No_] = p.[Item No_] "+
   
   " ) as color,"+
   " ("+
        " SELECT  CONCAT('"+process.env.APP_URL + "/resources/uploads/items/',IA.[Attribute Image]) FROM [DKMTEST16Dec19$Item Attributes] as IA"+
        " WHERE IA.[Item No_] = p.[Item No_] "+
   
   " ) as image"+
 
  " FROM [DKMTEST16Dec19$DKM Production] as p "+
  " LEFT OUTER JOIN [DKMTEST16Dec19$Item] as i ON  p.[Item No_] = i.[No_]  " +
  " WHERE p.Status=0";

  if(inventory.keyword){
    inProductionQuery += " AND ( i.[Description] LIKE '%"+inventory.keyword+"%' OR p.[Item No_] = '"+inventory.keyword+"')"
  }
  
  inProductionQuery += " GROUP BY p.[Variant No_],p.[Item No_] ORDER BY p.[Item No_] DESC" 


  inProductionQuery += " OFFSET " + (page - 1) * limit + " ROWS FETCH NEXT " + limit + " ROWS ONLY"

  try {  
        
    const inProductions= await dbConnection.query(inProductionQuery);
    console.log(inProductions);

    return await CommonService.paginationOutPut(
      inProductions[0],
      page,
      limit,
      count
    );

  } catch (error) {
    throw new Error(error);

  }


}

const getLowStocks = async (inventory) => {
  let limit = 10;


  inventoryQuery = {
    where: { 'Reorder Point': { [Op.ne]: 0 } },
    raw: true,
    attributes:{ 
      include:[
        [
          Sequelize.literal(`(select sum([Quantity]) as quantity FROM [dbo].[`+process.env.BC_DB_NAME+`$Item Ledger Entry]  as il
           WHERE il.[Item No_]=[`+process.env.BC_DB_NAME + `$Item].[No_] GROUP BY [Item No_]) `),
          'soh'
        ]
      ]
    },
    include: {
      model: Models[process.env.BC_DB_NAME + '$Item Attributes'],
      attributes:['Item Attribute Name',
        [ Sequelize.fn("concat", process.env.APP_URL+"/resources/uploads/items/",Sequelize.col("Attribute Image")),'product_image']
      ],
      required: false
    }
  };

  inventoryQuery.limit = limit;
  // if (_.isEmpty(inventory)) TE("Params are not set");
  let page = inventory.pageNumber != 0 ? inventory.pageNumber : 1;
  inventoryQuery.offset = (page - 1) * limit;
  inventoryQuery.raw = true;

  let [err, items] = await to(
    Models[process.env.BC_DB_NAME + '$Item'].findAndCountAll(inventoryQuery)
  );

  if (err) TE(err.message);

  paginationOutPut = await CommonService.paginationOutPut(
    items.rows,
    page,
    limit,
    items.count
  );
  return paginationOutPut;

};

const getDashboardDetails = async (a) => {

  let err;
  sohQuery = {
    where: {},
    attributes: [[sequelize.fn('sum', sequelize.col('Item Ledger Entry Quantity')), 'sohUnits'],
    [sequelize.fn('sum', sequelize.col('Sales Amount (Actual)')), 'Value']],
    include: {
      model:Models[process.env.BC_DB_NAME+'$Item'],
      attributes:[[sequelize.fn('count', sequelize.col(process.env.BC_DB_NAME+'$Item.NO_')), 'items_count']],
      where:{ type: 0 },
      required: true
    },   
    raw: true,
  };

  lowStockQuery = {
    where: {},
    attributes: [[sequelize.fn('sum', sequelize.col('Reorder Point')), 'lowStockUnit'], [sequelize.fn('sum', sequelize.col('Unit Price')), 'lowStockValue']],
    raw: true,
  };

  lowStockQueryBycustomer = {
    where: { 'en_ Prod_ Posting Group' : { [Op.notIn] : ['FGADHOC' ,'FGDKMBINV' ]}},
    attributes: [[sequelize.fn('sum', sequelize.col('Reorder Point')), 'lowStockUnit'], [sequelize.fn('sum', sequelize.col('Unit Price')), 'lowStockValue']],
    raw: true,
  };

  inProductionQuery =  "SELECT SUM(p.[Quantity]) AS [productionUnits], SUM(i.[Unit Price]) as productionValue"+
  " FROM ["+process.env.BC_DB_NAME+"$DKM Production] as p"+
  " LEFT OUTER JOIN ["+process.env.BC_DB_NAME+"$Item] as i ON  p.[Item No_] = i.[No_]"+
  " WHERE status = 0";

  inProductionCustomerQuery =  "SELECT sum(p.[Quantity]) AS [productionUnits],sum(i.[Unit Price]) as productionValue"+
  " FROM ["+process.env.BC_DB_NAME+"$DKM Production] as p"+
  " INNER JOIN ["+process.env.BC_DB_NAME+"$Item] as i ON  p.[Item No_] = i.[No_]"+
  " WHERE i.[Gen_ Prod_ Posting Group] NOT IN('FGADHOC' ,'FGDKMBINV') AND p.status = 0"+
  " AND i.[product website code] != ''";

  const query = "SELECT sum(ve.[Item Ledger Entry Quantity]) AS [sohUnits], sum(ve.[Sales Amount (Actual)]) AS [Value], COUNT(i.[product website code])"+
  " FROM ["+process.env.BC_DB_NAME+"$Value Entry] as ve "+
  " INNER JOIN ["+process.env.BC_DB_NAME+"$Item] as i ON  ve.[Item No_] = i.[No_]"+
  " WHERE ve.[Gen_ Prod_ Posting Group] NOT IN('FGADHOC' ,'FGDKMBINV')"+
  " AND i.[product website code] != ''";

  [err, dashboard] = await to(
    Models[process.env.BC_DB_NAME + "$Value Entry"].findAll(sohQuery)
  );
  if(err) TE(err.message);
  [err, dashboardLowStock] = await to(
    Models[process.env.BC_DB_NAME + "$Item"].findAll(lowStockQuery)
  );
  [err, LowStockByCustomer] = await to(
    Models[process.env.BC_DB_NAME + "$Item"].findAll(lowStockQuery)
  );
  
   try {
    const customerOwned = await dbConnection.query(query);
    const inProduction = await dbConnection.query(inProductionQuery);
    const inProductionCustomer = await dbConnection.query(inProductionCustomerQuery);

    console.log('dashboardSOH',dashboard);
    console.log('inProductionCustomer',inProductionCustomer);
    console.log('customerOwned',customerOwned);    
    console.log('dashboardLowStock',dashboardLowStock);
    console.log('LowStockByCustomer',LowStockByCustomer);
    const final = { 
        "soh": dashboard[0], 
        "soh_coustomer": customerOwned[0][0],
         lowStockRisk: dashboardLowStock[0],
        lowstockByCustomer:LowStockByCustomer[0],
        inProduction:inProduction[0][0],
        inProductionCustomer:inProductionCustomer[0][0],

   }
    if (err) TE(err.message);
    return final;

   } catch (error) {
    throw new Error(error);
   }
  

}

module.exports = { getInventorySOH, getLowStocks, getDashboardDetails,getInProduction };
