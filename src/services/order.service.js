const { to, TE,totalIncGST, formatDate } = require("./util.service");
const Models = require("../models/model");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const _ = require("lodash");
const CommonService = require("./common.service");
const dbConnection = require("../data/database/db");
const { param } = require("../routes/user.routes");

const getOrdersList = async (salesOrder) => {
  
  let limit = 10;
  companyQuery = {
    where: { 'Order Status': 0 },
    raw: true,
  };

  companyQuery.limit = limit;
  //if (_.isEmpty(salesOrder)) TE("Params are not set");
  let page = salesOrder.pageNumber != 0 ? salesOrder.pageNumber : 1;
  companyQuery.offset = (page - 1) * limit;

  if(salesOrder.orderNo)
    companyQuery.where["No_"] = salesOrder.orderNo;

  if(salesOrder.customer_no)
    companyQuery.where["Sell-to Customer No_"] = salesOrder.customer_no;


   let rawQuery = "SELECT  salesHeader.[Order Date],salesHeader.[Sell-to Customer No_],salesHeader.No_,salesHeader.[Order Status],customer.Name,customer.[CUSTOMER GROUP], "+
                     "salesHeader.[Assigned User ID], "+
                     "( SELECT "+
	                      "SUM(salesLine.[Amount Including VAT]) "+
		                    "FROM ["+process.env.BC_DB_NAME+"$Sales Line] as salesLine "+
		                    "WHERE salesLine.[Document No_] = salesHeader.[No_] "+
		                  ") as OrderValue " +
	                  "FROM  ["+process.env.BC_DB_NAME+"$Sales Header] as salesHeader "+
                    "INNER JOIN ["+process.env.BC_DB_NAME+"$Customer] AS customer ON salesHeader.[Sell-to Customer No_]=customer.No_"
                 
      rawQuery +=" WHERE salesHeader.[Document Type]=1"
      
    if(salesOrder.customer_no)     
       rawQuery +=" AND salesHeader.[Sell-to Customer No_]='"+salesOrder.customer_no+"'";

    if(salesOrder.orderNo)     
       rawQuery +=" AND salesHeader.No_='"+salesOrder.orderNo+"'";

    if(salesOrder.orderDate)     
       rawQuery +=" AND salesHeader.[Order Date]='"+salesOrder.orderDate+"'";

    if(salesOrder.sortBy) 
       rawQuery +=  " ORDER BY OrderValue "+salesOrder.sortBy;
    else
      rawQuery +=  " ORDER BY salesHeader.[Order Date] DESC";


       rawQuery +=  " OFFSET "+(page - 1) * limit+" ROWS FETCH NEXT "+limit+" ROWS ONLY"

        try {
    
          const orders = await dbConnection.query(rawQuery);

          let [err, OrderCount] = await to(
            Models[process.env.BC_DB_NAME+'$Sales Header'].count(companyQuery )
          );

          //console.log('OrderCount',OrderCount);
      
           if (err) TE(err.message);

           let [error, OtherOrderCount] = await to(
            Models[process.env.BC_DB_NAME+'$Sales Invoice Header'].count()
          );

          
          paginationOutPut = await CommonService.paginationOutPut(
            orders[0],
            page,
            limit,
            OrderCount
          );

          paginationOutPut['CompletedTotal']= OtherOrderCount;

          return paginationOutPut;

    } catch (error) {
      if (error) TE(error.message);
    }
 };

 const getCompletedOrdersList = async (salesOrder) => {
  
  let limit = 10;
  companyQuery = {
    where: {},
    raw: true,
  };

  companyQuery.limit = limit;
  //if (_.isEmpty(salesOrder)) TE("Params are not set");
  let page = salesOrder.pageNumber != 0 ? salesOrder.pageNumber : 1;
  companyQuery.offset = (page - 1) * limit;

  if(salesOrder.orderNo)
    companyQuery.where["No_"] = salesOrder.orderNo;

  if(salesOrder.customer_no)
  companyQuery.where["Sell-to Customer No_"] = salesOrder.customer_no;


   let rawQuery = "SELECT  salesInvoice.[Order Date],salesInvoice.[Sell-to Customer No_],salesInvoice.[Posting Date],salesInvoice.No_,customer.Name,customer.[CUSTOMER GROUP], "+
                     "( SELECT "+
	                      "SUM(salesLine.[Amount Including VAT]) "+
		                    "FROM ["+process.env.BC_DB_NAME+"$Sales Invoice Line] as salesLine "+
		                    "WHERE salesLine.[Document No_] = salesInvoice.[No_] "+
		                  ") as OrderValue " +
	                  "FROM  ["+process.env.BC_DB_NAME+"$Sales Invoice Header] as salesInvoice "+
                    "INNER JOIN ["+process.env.BC_DB_NAME+"$Customer] AS customer ON salesInvoice.[Sell-to Customer No_]=customer.No_"
      
    if(salesOrder.orderNo)     
       rawQuery +=" WHERE salesInvoice.No_="+salesOrder.orderNo;

       if(salesOrder.customer_no)     
       rawQuery +=" AND salesInvoice.[Sell-to Customer No_]='"+salesOrder.customer_no+"'";

       if(salesOrder.orderDate)     
       rawQuery +=" AND salesInvoice.[Order Date]='"+salesOrder.orderDate+"'";

    if(salesOrder.sortBy) 
       rawQuery +=  " ORDER BY OrderValue "+salesOrder.sortBy;
    else
      rawQuery +=  " ORDER BY salesInvoice.[Order Date] DESC";

       rawQuery +=  " OFFSET "+(page - 1) * limit+" ROWS FETCH NEXT "+limit+" ROWS ONLY"

        try {
    
          const orders = await dbConnection.query(rawQuery);
    
          let [err, OrderCount] = await to(
            Models[process.env.BC_DB_NAME+'$Sales Invoice Header'].count(companyQuery )
          );

           if (err) TE(err.message);

           let [error, OtherOrderCount] = await to(
            Models[process.env.BC_DB_NAME+'$Sales Header'].count()
          );          
          if (error) TE(error.message);


          paginationOutPut = await CommonService.paginationOutPut(
            orders[0],
            page,
            limit,
            OrderCount
          );
         
          paginationOutPut['pendingTotal']= OtherOrderCount;

          return paginationOutPut;

    } catch (error) {
      if (error) TE(error.message);
    }
 };

const getOrderDetail = async (query) => {

  companyQuery = {
    where: { 'No_': query.orderNo },
    attributes: ["Order Date", "No_", "Assigned User ID", "Order Status"],
    include: [{
      model: Models[process.env.BC_DB_NAME + '$Customer'],
      required: true, // inner join
      attributes: [
        "Name",
        "Contact",
        [ Sequelize.fn("concat", Sequelize.col("COMPANY LOGO") ? process.env.APP_URL+"/resources/uploads/company/": ' ',Sequelize.col("COMPANY LOGO")),'logo'],
        [ Sequelize.fn("concat", process.env.APP_URL+"/resources/uploads/company/",Sequelize.col("Company Banner Image")),'banner'],
      ]
    }],
    raw: true
  }


  let [err, orderDetail] = await to(
    Models[process.env.BC_DB_NAME + '$Sales Header'].findAndCountAll(companyQuery)
  );

  if (err) TE(err.message);

  productQuery = {
    where: { 'Document No_': query.orderNo },
    include: [{
      model: Models[process.env.BC_DB_NAME + '$Item Attributes'],
      attributes:['Item Attribute Name',
        [ Sequelize.fn("concat", process.env.APP_URL+"/resources/uploads/items/",Sequelize.col("Attribute Image")),'product_image']
      ]
    }
    ],
    raw:true
  }

  let [error, products] = await to(
    Models[process.env.BC_DB_NAME + '$Sales Line'].findAll(productQuery)
  );

 
  let finalProducts = [];
  var stockCounts = [];

  await Promise.all(
    /*
     This loop will fetch the 
    */
  
   products.map(async (product, index) => {
      
     stockCounts[product.No_] = await getLatestStockQuantity(product.No_,product['Variant Code'])
     return stockCounts;
      
   })).then(async result => {

    products.map(async (product, index) => {   
      finalProducts.push(
        { ...product,
          soh:_.isEmpty(stockCounts[product.No_][0]) ? 0 : stockCounts[product.No_][0][0].quantity,
          varinace:_.isEmpty(stockCounts[product.No_][0]) ? product['Quantity'] : product['Quantity'] * stockCounts[product.No_][0][0].quantity
        });
    });

   });


  if (error) TE(error.message);

  const { rows } = orderDetail;

  const order = { customerDetail: rows[0], products: finalProducts }

  return order;
};

  const getCompletedOrderDetail = async(query) => {

    let limit = 10;
    companyQuery = {
      where: { 'No_': query.orderNo },
      attributes: ["Order Date","Posting Date","No_"],
      include: [{
        model:Models[process.env.BC_DB_NAME+'$Customer'],
        required: true, // inner join
        attributes: [  "Name",
        "Contact",
        [ Sequelize.fn("concat", process.env.APP_URL+"/resources/uploads/company/",Sequelize.col("COMPANY LOGO")),'logo'],
        [ Sequelize.fn("concat", process.env.APP_URL+"/resources/uploads/company/",Sequelize.col("Company Banner Image")),'banner']],
      }],
      raw: true
    }
  
      companyQuery.limit = limit;
      //if (_.isEmpty(salesOrder)) TE("Params are not set");
      let page = query.pageNumber != 0 ? query.pageNumber : 1;
      companyQuery.offset = (page - 1) * limit;
    
      let [err, orderDetail] = await to(
       Models[process.env.BC_DB_NAME+'$Sales Invoice Header'].findAndCountAll(companyQuery )
      );
  
      if (err) TE(err.message);
  
      productQuery = {
        where: { 'Document No_': query.orderNo },
        include: [{ 
            model:Models[process.env.BC_DB_NAME+'$Item Attributes'],
          }
        ],
        raw: true
      }
  
      let [error, products] = await to(
        Models[process.env.BC_DB_NAME+'$Sales Invoice Line'].findAll(productQuery )
      );
  
      
  let finalProducts = [];
  var stockCounts = [];
  await Promise.all(
    /*
     This loop will fetch the 
    */
  
   products.map(async (product, index) => {
      
     stockCounts[product.No_] = await getLatestStockQuantity(product.No_,product['Variant Code'])
     return stockCounts;
      
   })).then(async result => {

    products.map(async (product, index) => {     
      finalProducts.push({ 
        ...product,
        soh:_.isEmpty(stockCounts[product.No_][0]) ? 0 : stockCounts[product.No_][0][0].quantity,
        varinace:_.isEmpty(stockCounts[product.No_][0]) ? product['Quantity'] : product['Quantity'] * stockCounts[product.No_][0][0].quantity
      });
    });

   });

  //console.log(products.rows);
  
      if (error) TE(error.message);
  
       const  { rows } =  orderDetail;
       const order = { customerDetail: rows[0],  products: finalProducts }
  
  
        return order;
    };

  const getLatestStockQuantity = async (itemNo,size) => {
    
  const query = "select sum([Quantity]) as quantity,[Item No_] FROM [dbo].[DKMTEST16Dec19$Item Ledger Entry]  WHERE [Item No_] = '"+itemNo+"' AND [Variant Code]= '"+size+"' "+
  "GROUP BY [Item No_],[Variant Code]";
    try {
      
      return await dbConnection.query(query);

   
    } catch (error) {
      throw new Error(error);
    }

  }

  const getOrderInvoice = async(query) => {

    companyQuery = {
      where: { 'No_': query.orderNo },
      attributes: ["Order Date","No_","Assigned User ID","Order Status"],
      include: [{
        model:Models[process.env.BC_DB_NAME+'$Customer'],
        required: true, // inner join
        attributes: ["Name",
          "Contact",
          [ Sequelize.fn("concat", process.env.APP_URL+"/resources/uploads/company/",Sequelize.col("COMPANY LOGO")),'logo'],
          [ Sequelize.fn("concat", process.env.APP_URL+"/resources/uploads/company/",Sequelize.col("Company Banner Image")),'banner']
        ]
      }],
      raw: true
    }
    
      let [err, orderDetail] = await to(
        Models[process.env.BC_DB_NAME+'$Sales Header'].findAll(companyQuery )
      );
  
      if (err) TE(err.message);
  
      productQuery = {
        where: { 'Document No_': query.orderNo },
        include: [{ 
            model:Models[process.env.BC_DB_NAME+'$Item Attributes'],
            attributes:['Item Attribute Name',
              [ Sequelize.fn("concat", process.env.APP_URL+"/resources/uploads/items/",Sequelize.col("Attribute Image")),'product_image']
            ] 
          }
        ],
        raw:true
      }
  
      let [error, products] = await to(
        Models[process.env.BC_DB_NAME+'$Sales Line'].findAll(productQuery ) 
      );
  
  //console.log(products.rows);
  
      if (error) TE(error.message);
      //if (err) TE(err.message);
       var stockCounts = [];
  
       await Promise.all(
         /*
          This loop will fetch the 
         */
        products.map(async (product, index) => {
           
          stockCounts[product.No_] = await getLatestStockQuantity(product.No_,product['Variant Code'])
  
          return stockCounts;
           
        })).then(async result => {
  
         // console.log('promise', stockCounts);
          let subTotalsIncGST = [];
          let subTotalsExGST = [];
          let allProducts = [];
          products.map(async (product, index) => {          
            allProducts.push({ ...product,soh:_.isEmpty(stockCounts[product.No_][0]) ? 0 : stockCounts[product.No_][0][0].quantity});
            subTotalsIncGST.push(product['Amount Including VAT']);
            subTotalsExGST.push(product['Amount']);
          });
           
           const subTotalIncGST = subTotalsIncGST.reduce(function(a, b){
              return a + b;
            }, 0);
            const subTotalExGST = subTotalsExGST.reduce(function(a, b){
              return a + b;
            }, 0);

             const order = {
                customerDetail: orderDetail[0],  
                products: allProducts, 
                subTotalsincGST:subTotalIncGST,
                GST:totalIncGST(subTotalExGST,orderDetail['Currency code']),
                subTotalsexGST:subTotalExGST 
              }
  
             paginationOutPut = order;
        })
        return paginationOutPut;
    };

  const getCompletedOrderInvoice = async(query) => {

      let limit = 10;
      companyQuery = {
        where: { 'No_': query.orderNo },
        attributes: ["Order Date","No_","Posting Date"],
        include: [{
          model:Models[process.env.BC_DB_NAME+'$Customer'],
          required: true, // inner join
          attributes: ["Name",
            "Contact",
            [ Sequelize.fn("concat", process.env.APP_URL+"/resources/uploads/company/",Sequelize.col("COMPANY LOGO")),'logo'],
            [ Sequelize.fn("concat", process.env.APP_URL+"/resources/uploads/company/",Sequelize.col("Company Banner Image")),'banner']
          ]
        }],
        raw: true
      }
    
        companyQuery.limit = limit;
        //if (_.isEmpty(salesOrder)) TE("Params are not set");
        let page = query.pageNumber != 0 ? query.pageNumber : 1;
        companyQuery.offset = (page - 1) * limit;
      
        let [err, orderDetail] = await to(
         Models[process.env.BC_DB_NAME+'$Sales Invoice Header'].findAll(companyQuery )
        );
    
        if (err) TE(err.message);
    
        productQuery = {
          where: { 'Document No_': query.orderNo },
          include: [{ 
              model:Models[process.env.BC_DB_NAME+'$Item Attributes'],
              attributes:['Item Attribute Name',
                [ Sequelize.fn("concat", process.env.APP_URL+"/resources/uploads/items/",Sequelize.col("Attribute Image")),'product_image']
              ] 
            }
          ],
          raw:true
        }
    
        let [error, products] = await to(
          Models[process.env.BC_DB_NAME+'$Sales Invoice Line'].findAll(productQuery ) 
        );
    
    //console.log(products.rows);
    
        if (error) TE(error.message);

        //if (err) TE(err.message);
         var stockCounts = [];
    
         await Promise.all(
           /*
            This loop will fetch the 
           */
          products.map(async (product, index) => {
             
            stockCounts[product.No_] = await getLatestStockQuantity(product.No_,product['Variant Code'])
    
            return stockCounts;
             
          })).then(async result => {
    
           // console.log('promise', stockCounts);
            let subTotalsIncGST = [];
            let subTotalsExGST = [];
            let allProducts = [];
            products.map(async (product, index) => {          
              allProducts.push({ ...product,soh:_.isEmpty(stockCounts[product.No_][0]) ? 0 : stockCounts[product.No_][0][0].quantity});
              subTotalsIncGST.push(product['Amount Including VAT']);
              subTotalsExGST.push(product['Amount']);
            });
             
             const subTotalIncGST = subTotalsIncGST.reduce(function(a, b){
                return a + b;
              }, 0);
              const subTotalExGST = subTotalsExGST.reduce(function(a, b){
                return a + b;
              }, 0);
  
               const order = {
                  customerDetail: orderDetail[0],  
                  products: allProducts, 
                  subTotalsincGST:subTotalIncGST,
                  GST:totalIncGST(subTotalExGST,orderDetail['Currency code']),
                  subTotalsexGST:subTotalExGST 
                }
    
               paginationOutPut = order;
          })
          return paginationOutPut;
  };

  const getExchangeRequests = async (params) => {
    let limit = 10;
    
    userQuery = {
      where: { type: params.type},
      raw:true,
      include:[
        {  model: Models.users,as:'requestedBy',attributes:['first_name','last_name'] },
        {  model: Models.users,as:'approvedBy',attributes:['first_name','last_name'] },
      ],
      order: [ ['id','DESC'] ]
    }

    if(params.keyword) {
      userQuery.where[Op.or]= [  { order_no: params.keyword },
                                  { customer_no: params.keyword }];
    }

    if(params.is_approved)
      userQuery.where['is_approved'] = params.is_approved;

    userQuery.limit = limit;
    //if (_.isEmpty(salesOrder)) TE("Params are not set");
    let page = params.pageNumber != 0 ? params.pageNumber : 1;
    userQuery.offset = (page - 1) * limit;


    let [err, orders] = await to( Models.exchange_order_requests.findAll(userQuery))
   
   
      let [errors, pendingCount] = await to( Models.exchange_order_requests.count({ where: { type: params.type, is_approved: 0}}))
  
      let  [error, completedCount] = await to( Models.exchange_order_requests.count({ where: { type: params.type, is_approved: 1}}))

    if (err) TE(err.message);  
    if (error) TE(error.message);  

    let finalOrders = []

   await Promise.all(
    orders.map((async order => {

      let [err, customer] = await to( Models[process.env.BC_DB_NAME+'$Customer'].findOne(
         { 
           where: {
            'No_': order['customer_no'],
           },
           attributes:{ 
            include: [
              [ `( SELECT c.Name from [`+ process.env.BC_DB_NAME+'$Customer'+`] as c where c.[Customer Group] =  `+process.env.BC_DB_NAME+'$Customer'+`.[Customer Group]  AND [Customer Type] = 0)`, 'parent company']
            ]
           },
          
           raw:true
           
         }
      ))

      if(err) TE(err.message)

      return finalOrders.push({...order,customer })
    }))
   ).then(async result => {
   })
    
   finalOrders = { finalOrders,pendingCount : pendingCount,completedCount: completedCount}
  return paginationOutPut = await CommonService.paginationOutPut(
      finalOrders,
       page,
       limit,
       orders.length
     );
  }


  const getExchangeOrderDetail = async (params) => {
    
    userQuery = {
      where: { exchange_order_id: params.id},
      raw:true,
    }

    let [err, orders] = await to( Models.exchange_order_items.findAll(userQuery))
    let [errs, order] = await to( Models.exchange_order_requests.findByPk(
      params.id,      
      { include:{model:Models['users'],as:'requestedBy',attributes:['first_name']},attributes: [ 'order_no','customer_no','approved_by', 'approved_date' ],
      raw:true }))

    if (err) TE(err.message);
    if (errs) TE(errs.message);

    let [error, company] = await to(
      Models[process.env.BC_DB_NAME + "$Customer"].findOne({
        where : { No_ : order['customer_no'] },
        attributes: ["Name","COMPANY LOGO","Company Banner Image"],
        raw: true 
      })
    );

    if (error) TE(error.message);
    
    var items = []
    await Promise.all(

      orders.map(async order => {
        const [err, item] = await to(
          Models[process.env.BC_DB_NAME+'$Item'].findOne({
            where : { 'No_' : order['old_item_no'] },
            attributes:['No_','Description'],
            include: {
              model:Models[process.env.BC_DB_NAME+'$Item Attributes'],
              required: false
            }              
          })
        );
        let new_item = [];
        if(order['new_item_no'] ) {        
          [error, new_item] = await to(
            Models[process.env.BC_DB_NAME+'$Item'].findOne({
              where : { 'No_' : order['new_item_no'] },
              attributes:['No_','Description'],        
              raw:true    
            })
          );
        }
        

        let image = item.dataValues[process.env.BC_DB_NAME+'$Item Attribute'] !== null ? 
        item.dataValues[process.env.BC_DB_NAME+'$Item Attribute']['Attribute Image'] : '';

          items.push({ ...order, new_item:new_item,'old_product': item.dataValues,image:process.env.APP_URL + "/resources/uploads/items/" +image } )
          
          return items;
             
      })).then(async result => {

      }
    )

    if (err) TE(err.message);  
   items = { items, company,order}
    return await CommonService.paginationOutPut(
      items,
      0,
      10,
      items.length
    );

  }

  const approveExchangeOrder  = async (data,user) => {

    const fields = { is_approved:1, approved_by: user.id,approved_date:formatDate(new Date() )}
    return await Models.exchange_order_requests.update(fields, { where: { id: data.id } });    
  }

  const getCompletedOrdersCount =  async (params) => {

    let date = new Date();
    
    const currStartDate = date.getFullYear()+"-"+date.getMonth()+1+"-"+1+ " 00:00:00";
    const currEndDate = formatDate(new Date(date.getFullYear(), date.getMonth()+1, 0)) + " 23:59:59";

    date = new Date();

    date.setDate(1);date.setMonth(date.getMonth()-1);

    const prevStartDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    const prevEndDate = new Date(date.getFullYear(), date.getMonth(), 0);


    let [error, current] = await to(
      Models[process.env.BC_DB_NAME+'$Sales Invoice Header'].count()
    );
    

    return current;
  }
  
module.exports = {getOrdersList,getCompletedOrdersList,getOrderDetail,getOrderInvoice,getCompletedOrderDetail,
  getCompletedOrderInvoice,getExchangeRequests,getExchangeOrderDetail,approveExchangeOrder,getCompletedOrdersCount};
