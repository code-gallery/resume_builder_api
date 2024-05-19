const { to, TE, formatDate, incrementNo, readHTMLFile } = require("../services/util.service");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const _ = require('lodash');
const Models = require('../models/model')
const dbConnection = require("../data/database/db");
const CommonService = require('./common.service');
const sgMail = require('@sendgrid/mail')
var handlebars = require('handlebars');
const { Model } = require("sequelize");

const orderConfirmation = async (orderInfo, cart_items, logo,company) => {

  var currentPath = process.cwd();  
   console.log('cart_items',cart_items);
  orderInfo.productDetails = cart_items;

  readHTMLFile(currentPath + '/resources/views/emails/orderInvoice.html', function (err, html) {

    let template = handlebars.compile(html);
    if (orderInfo.new_shipping == 1) {
      orderInfo.shipCustName = orderInfo['Ship-to Name'];
      orderInfo.shipping_add1 = orderInfo['Ship-to Address'];
      orderInfo.shipping_add2 = orderInfo['Ship-to Address 2'];
      orderInfo.shipping_add3 = orderInfo['Ship-to City'];
      orderInfo.shipping_add4 = orderInfo['Ship-to Post Code'];
      orderInfo.shipping_add5 = orderInfo['Ship-to County'];
      orderInfo.shipContact = orderInfo['Ship-to Phone No'];

    } else {
      orderInfo.shipCustName = orderInfo['Sell-to Customer Name'];
      orderInfo.shipping_add1 = orderInfo['Sell-to Address'];
      orderInfo.shipping_add2 = orderInfo['Sell-to Address 2'];
      orderInfo.shipping_add3 = orderInfo['Sell-to City'];
      orderInfo.shipping_add4 = orderInfo['Sell-to Post Code'];
      orderInfo.shipping_add5 = orderInfo['Sell-to County'];
      orderInfo.shipContact = orderInfo['Sell-to Phone No_'];

    }

    // const productDetailsHtml = `<td style="font-family: 'Poppins', sans-serif; color: #202945; font-size: 10px; line-height: 15px;">
    // ${orderInfo.productDetails[0].dataValues.item_name}</td>`
    var htmlToSend = template({
      productDetails: orderInfo.productDetails, cust_name: orderInfo['Sell-to Customer Name'], shipCustName: orderInfo.shipCustName, ship_add1: orderInfo.shipping_add1, ship_add2: orderInfo.shipping_add2,
      ship_add3: orderInfo.shipping_add2, ship_add4: orderInfo.shipping_add4, ship_add5: orderInfo.shipping_add5, billCustName: orderInfo['Sell-to Customer Name'], bill_add1: orderInfo['Sell-to Address'],
      bill_add2: orderInfo['Sell-to Address 2'], bill_add3: orderInfo['Sell-to City'], bill_add4: orderInfo['Sell-to Post Code'],
      bill_add5: orderInfo['Sell-to County'], billContact: orderInfo['Sell-to Phone No_'], shipEmail: orderInfo['Ship-to E-mail'], billEmail: orderInfo['Sell-to E-Mail'],
      subTotal: orderInfo.cart_summary.sub_total, shipHand: orderInfo.cart_summary.shipping, grandTotal: orderInfo.cart_summary.grand_total,
      tax: orderInfo.cart_summary.tax, grandTotalTax: orderInfo.cart_summary.grand_total_inc_tax, shipContact: orderInfo.shipContact,
      APP_URL: process.env.APP_URL,
      logo: logo
    });

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
      to: 'tushar.barate@adcreators.com.au', // Change to your recipient
      from: process.env.EMAIL_FROM, // Change to your verified sender
      subject: 'Order Confirmation',
      text: 'and easy to do anywhere, even with Node.js',
      html: htmlToSend,
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
  })
}

const placeOrder = async (orderInfo, user) => {
  //console.log(orderInfo);
 
  const lastCustomerId = await Models[process.env.BC_DB_NAME + '$No_ Series Line'].findOne({ where: { 'Series Code': 'SO' } })
  const incrementedId = 'SO0' + incrementNo(lastCustomerId.dataValues['Last No_ Used']);

  let lastPostingNo = await Models[process.env.BC_DB_NAME + '$No_ Series Line'].findOne({ where: { 'Series Code': 'PSI' } })
  const newId = await dbConnection.query(
    'SELECT NEWID()', { plain: true, raw: true }
  );
  console.log('newId', newId);
  /*
    Above code will fetch the last inserted No_ of customer table
    We will increment into it manually and add to customer query
  */

  customerQuery = {
    where: {},
    raw: true
  };

  customerQuery.where["No_"] = orderInfo['Sell-to Customer No_'];

  let [error, company] = await to(
    Models[process.env.BC_DB_NAME + "$Customer"].findByPk(orderInfo['Sell-to Customer No_'])
  );

  let [errs, userInfo] = await to(
    Models["users"].findByPk(user.id, { raw: true })
  );

  if (error) TE(error.message);
  if (errs) TE(errs.message);

  let vatRegisterNo = company['VAT Registration No_'];
  let puchase_order_no = orderInfo['puchase_order_no'] ? orderInfo['puchase_order_no'] : ' ';
  let location_code = company['Location Code'] ? company['Location Code'] : ' ';
  let salesp_code = company['Salesperson Code'] ? company['Salesperson Code'] : ' ';

  const currency = orderInfo["currency_code"];

  const bus_posting = currency == 'NZD' ? 'NZ' : 'DOMESTIC';
  const vat_identifier = currency == 'NZD' ? 'NZ GST' : 'GST';
  const VAT_country_region_code = currency == 'NZD' ? 'NZ' : 'AU';


  const addSHQuery = "INSERT INTO [dbo].[" + process.env.BC_DB_NAME + "$Sales Header]" +
    "([Document Type],[No_],[Sell-to Customer No_],[Bill-to Customer No_],[Bill-to Name]" +
    ",[Bill-to Name 2],[Bill-to Address],[Bill-to Address 2],[Bill-to City],[Bill-to Contact]" +
    ",[Your Reference],[Ship-to Code],[Ship-to Name],[Ship-to Name 2],[Ship-to Address]" +
    ",[Ship-to Address 2],[Ship-to City],[Ship-to Contact],[Order Date],[Posting Date]" +
    ",[Shipment Date],[Posting Description],[Payment Terms Code],[Due Date],[Payment Discount _]" +
    ",[Pmt_ Discount Date],[Shipment Method Code],[Location Code],[Shortcut Dimension 1 Code],[Shortcut Dimension 2 Code]" +
    ",[Customer Posting Group],[Currency Code],[Currency Factor],[Customer Price Group],[Prices Including VAT]" +
    ",[Invoice Disc_ Code],[Customer Disc_ Group],[Language Code],[Salesperson Code],[Order Class]" +
    ",[No_ Printed],[On Hold],[Applies-to Doc_ Type],[Applies-to Doc_ No_],[Bal_ Account No_]" +
    ",[Ship],[Invoice],[Print Posted Documents],[Shipping No_],[Posting No_],[Last Shipping No_]" +
    ",[Last Posting No_],[Prepayment No_],[Last Prepayment No_],[Prepmt_ Cr_ Memo No_],[Last Prepmt_ Cr_ Memo No_]" +
    ",[VAT Registration No_],[Combine Shipments],[Reason Code],[Gen_ Bus_ Posting Group],[EU 3-Party Trade]" +
    ",[Transaction Type],[Transport Method],[VAT Country_Region Code],[Sell-to Customer Name],[Sell-to Customer Name 2]" +
    ",[Sell-to Address],[Sell-to Address 2],[Sell-to City],[Sell-to Contact],[Bill-to Post Code]" +
    ",[Bill-to County],[Bill-to Country_Region Code],[Sell-to Post Code],[Sell-to County],[Sell-to Country_Region Code]" +
    ",[Ship-to Post Code],[Ship-to County],[Ship-to Country_Region Code],[Bal_ Account Type],[Exit Point]" +
    ",[Correction],[Document Date],[External Document No_],[Area],[Transaction Specification]" +
    ",[Payment Method Code],[Shipping Agent Code],[Package Tracking No_],[No_ Series],[Posting No_ Series]" +
    ",[Shipping No_ Series],[Tax Area Code],[Tax Liable],[VAT Bus_ Posting Group],[Reserve]" +
    ",[Applies-to ID],[VAT Base Discount _],[Status],[Invoice Discount Calculation],[Invoice Discount Value]" +
    ",[Send IC Document],[IC Status],[Sell-to IC Partner Code],[Bill-to IC Partner Code],[IC Direction]" +
    ",[Prepayment _],[Prepayment No_ Series],[Compress Prepayment],[Prepayment Due Date],[Prepmt_ Cr_ Memo No_ Series]" +
    ",[Prepmt_ Posting Description],[Prepmt_ Pmt_ Discount Date],[Prepmt_ Payment Terms Code],[Prepmt_ Payment Discount _],[Quote No_]" +
    ",[Quote Valid Until Date],[Quote Sent to Customer],[Quote Accepted],[Quote Accepted Date],[Job Queue Status]" +
    ",[Job Queue Entry ID],[Incoming Document Entry No_],[IsTest],[Sell-to Phone No_],[Sell-to E-Mail]" +
    ",[Payment Instructions Id],[Work Description],[Dimension Set ID],[Payment Service Set ID],[Direct Debit Mandate ID]" +
    ",[Doc_ No_ Occurrence],[Campaign No_],[Sell-to Customer Template Code],[Sell-to Contact No_],[Bill-to Contact No_]" +
    ",[Bill-to Customer Template Code],[Opportunity No_],[Responsibility Center],[Shipping Advice],[Posting from Whse_ Ref_]" +
    ",[Requested Delivery Date],[Promised Delivery Date],[Shipping Time],[Outbound Whse_ Handling Time],[Shipping Agent Service Code]" +
    ",[Receive],[Return Receipt No_],[Return Receipt No_ Series],[Last Return Receipt No_],[Allow Line Disc_]" +
    ",[Get Shipment Used],[Id],[Assigned User ID],[Adjustment],[BAS Adjustment]" +
    ",[Adjustment Applies-to],[WHT Business Posting Group],[Tax Document Type],[Printed Tax Document],[Posted Tax Document]" +
    ",[Tax Document Marked],[Order Status],[Ship-to Phone No],[Contact E-mail])" +
    "VALUES " ;

    const SLdata = [1, incrementedId , orderInfo["Sell-to Customer No_"] , orderInfo["Sell-to Customer No_"] , company["Name"]
    ,' ', orderInfo["Sell-to Address"] , orderInfo["Sell-to Address 2"] , orderInfo["Sell-to City"] , orderInfo["Sell-to Contact"]
    ,' ',' ', orderInfo["Ship-to Name"] ,' ', orderInfo["Ship-to Address"]
    , orderInfo["Ship-to Address 2"] , orderInfo["Ship-to City"] , orderInfo["Ship-to Contact"] , formatDate(new Date()) + " 00:00:00", formatDate(new Date()) + " 00:00:00"
    , formatDate(new Date()) + " 00:00:00",' ',' ', formatDate(new Date()) + " 00:00:00",0
    , formatDate(new Date()) + " 00:00:00",' ', location_code ,' ',' '
    , bus_posting , currency , orderInfo['conversion_value'] ,' ',0
    ,' ',' ',' ', salesp_code ,' '
    ,2,' ',0,' ',' '
    ,0,0,0,' ',' ',' '
    , lastPostingNo.dataValues['Last No_ Used'] ,' ', lastPostingNo.dataValues['Last No_ Used'] ,' ',' '
    , vatRegisterNo ,0,' ', orderInfo["Ship-to Address 2"] ,0
    ,' ',' ', VAT_country_region_code , company["Name"] ,' '
    , orderInfo["Sell-to Address"] , orderInfo["Sell-to Address 2"] , orderInfo["Sell-to City"] , userInfo["user_name"] , orderInfo["Sell-to Post Code"] 
    , orderInfo["Sell-to County"] , orderInfo["Sell-to Country_Region Code"] , orderInfo["Sell-to Post Code"] , orderInfo["Sell-to County"] , orderInfo["Sell-to Country_Region Code"] 
    , orderInfo["Ship-to Post Code"] , orderInfo["Ship-to County"] , orderInfo["Ship-to Country_Region Code"] ,0,' '
    ,0, formatDate(new Date()) + " 00:00:00", puchase_order_no ,' ',' '
    ,' ',' ',' ','SO',' '
    ,'SHIPMENT',' ',0, bus_posting ,1
    ,' ',0,0,0,0
    ,0,0,' ',' ',0
    ,0,'S.PREPAYMENT',1, formatDate(new Date()) + " 00:00:00",'PPT ADJ'
    ,' ', formatDate(new Date()) + " 00:00:00",'30 DAYS',0,' '
    ,'1753-01-01 00:00:00.000','1753-01-01 00:00:00.000',0,'1753-01-01 00:00:00.000',0
    ,'00000000-0000-0000-0000-000000000000',0,0, orderInfo["Phone No_"] , orderInfo["Contact E-mail"] 
    ,0,' ',0,0,' '
    ,1,' ',' ',' ',' '
    ,' ',' ',' ',0,0
    , formatDate(new Date()) + " 00:00:00", formatDate(new Date()) + " 00:00:00",' ',' ',' '
    ,0,' ',' ',' ',1
    ,0, newId[''] ,' ',0,0
    ,' ',' ',0,0,0
    ,0,0, orderInfo["Ship-to Phone No"] , orderInfo["Contact E-mail"] ]
 
    let  insertSalesHData =[];
    insertSalesHData.push(SLdata)
  itemQuery = {
    where: {},
    raw: true
  };
  itemQuery.where["customer_no"] = orderInfo['Sell-to Customer No_'];

  let [err, cart_items] = await to(Models.cart_items.findAll(itemQuery));
  if (err) TE(err.message);

  let addSLQuery = "INSERT INTO [dbo].[" + process.env.BC_DB_NAME + "$Sales Line]" +
    "([Document Type],[Document No_],[Line No_],[Sell-to Customer No_],[Type]" +
    ",[No_],[Location Code],[Posting Group],[Shipment Date],[Description]" +
    ",[Description 2],[Unit of Measure],[Quantity],[Outstanding Quantity],[Qty_ to Invoice]" +
    ",[Qty_ to Ship],[Unit Price],[Unit Cost (LCY)],[VAT _],[Line Discount _]" +
    ",[Line Discount Amount],[Amount],[Amount Including VAT],[Allow Invoice Disc_],[Gross Weight]" +
    ",[Net Weight],[Units per Parcel],[Unit Volume],[Appl_-to Item Entry],[Shortcut Dimension 1 Code]" +
    ",[Shortcut Dimension 2 Code],[Customer Price Group],[Job No_],[Work Type Code],[Recalculate Invoice Disc_]" +
    ",[Outstanding Amount],[Qty_ Shipped Not Invoiced],[Shipped Not Invoiced],[Quantity Shipped],[Quantity Invoiced]" +
    ",[Shipment No_],[Shipment Line No_],[Profit _],[Bill-to Customer No_],[Inv_ Discount Amount]" +
    ",[Purchase Order No_],[Purch_ Order Line No_],[Drop Shipment],[Gen_ Bus_ Posting Group],[Gen_ Prod_ Posting Group]" +
    ",[VAT Calculation Type],[Transaction Type],[Transport Method],[Attached to Line No_],[Exit Point]" +
    ",[Area],[Transaction Specification],[Tax Category],[Tax Area Code],[Tax Liable]" +
    ",[Tax Group Code],[VAT Clause Code],[VAT Bus_ Posting Group],[VAT Prod_ Posting Group],[Currency Code]" +
    ",[Outstanding Amount (LCY)],[Shipped Not Invoiced (LCY)],[Shipped Not Inv_ (LCY) No VAT],[Reserve],[Blanket Order No_]" +
    ",[Blanket Order Line No_],[VAT Base Amount],[Unit Cost],[System-Created Entry],[Line Amount]" +
    ",[VAT Difference],[Inv_ Disc_ Amount to Invoice],[VAT Identifier],[IC Partner Ref_ Type],[IC Partner Reference]" +
    ",[Prepayment _],[Prepmt_ Line Amount],[Prepmt_ Amt_ Inv_],[Prepmt_ Amt_ Incl_ VAT],[Prepayment Amount]" +
    ",[Prepmt_ VAT Base Amt_],[Prepayment VAT _],[Prepmt_ VAT Calc_ Type],[Prepayment VAT Identifier],[Prepayment Tax Area Code]" +
    ",[Prepayment Tax Liable],[Prepayment Tax Group Code],[Prepmt Amt to Deduct],[Prepmt Amt Deducted],[Prepayment Line]" +
    ",[Prepmt_ Amount Inv_ Incl_ VAT],[Prepmt_ Amount Inv_ (LCY)],[IC Partner Code],[Prepmt_ VAT Amount Inv_ (LCY)],[Prepayment VAT Difference]" +
    ",[Prepmt VAT Diff_ to Deduct],[Prepmt VAT Diff_ Deducted],[Pmt_ Discount Amount],[Line Discount Calculation],[Dimension Set ID]" +
    ",[Qty_ to Assemble to Order],[Qty_ to Asm_ to Order (Base)],[Job Task No_],[Job Contract Entry No_],[Deferral Code]" +
    ",[Returns Deferral Start Date],[Variant Code],[Bin Code],[Qty_ per Unit of Measure],[Planned]" +
    ",[Unit of Measure Code],[Quantity (Base)],[Outstanding Qty_ (Base)],[Qty_ to Invoice (Base)],[Qty_ to Ship (Base)]" +
    ",[Qty_ Shipped Not Invd_ (Base)],[Qty_ Shipped (Base)],[Qty_ Invoiced (Base)],[FA Posting Date],[Depreciation Book Code]" +
    ",[Depr_ until FA Posting Date],[Duplicate in Depreciation Book],[Use Duplication List],[Responsibility Center],[Out-of-Stock Substitution]" +
    ",[Originally Ordered No_],[Originally Ordered Var_ Code],[Cross-Reference No_],[Unit of Measure (Cross Ref_)],[Cross-Reference Type],[Cross-Reference Type No_]" +
    ",[Item Category Code],[Nonstock],[Purchasing Code],[Product Group Code],[Special Order]" +
    ",[Special Order Purchase No_],[Special Order Purch_ Line No_],[Completely Shipped],[Requested Delivery Date],[Promised Delivery Date]" +
    ",[Shipping Time],[Outbound Whse_ Handling Time],[Planned Delivery Date],[Planned Shipment Date],[Shipping Agent Code]" +
    ",[Shipping Agent Service Code],[Allow Item Charge Assignment],[Return Qty_ to Receive],[Return Qty_ to Receive (Base)],[Return Qty_ Rcd_ Not Invd_]" +
    ",[Ret_ Qty_ Rcd_ Not Invd_(Base)],[Return Rcd_ Not Invd_],[Return Rcd_ Not Invd_ (LCY)],[Return Qty_ Received],[Return Qty_ Received (Base)]" +
    ",[Appl_-from Item Entry],[BOM Item No_],[Return Receipt No_],[Return Receipt Line No_],[Return Reason Code]" +
    ",[Copied From Posted Doc_],[Allow Line Disc_],[Customer Disc_ Group],[Subtype],[Price description]" +
    ",[Prepmt_ VAT Amount Deducted],[Prepmt_ VAT Base Deducted],[WHT Business Posting Group],[WHT Product Posting Group],[WHT Absorb Base])" +

    " VALUES ";

  var insertQuery = [];
  let line_no = 10000;

  let itemNos = cart_items.map(item => item.item_code);


  const CartItemDetails = await to(Models[process.env.BC_DB_NAME + "$Item"].findAll({
    where: {
      No_: {
        [Op.in]: itemNos
      }
    },
    attribues: ['Gen_ Prod_ Posting Group', 'VAT Prod_ Posting Group', 'Inventory Posting Group', 'WHT Product Posting Group'],
    raw: true
  }));

  let allCartProd = [];
  CartItemDetails[1].map(item => {
    allCartProd[item['No_']] = item
  })

  var queryString = '';

  cart_items.map(item => {

    const currency = item["currency_code"] ? item["currency_code"] : ' ';
    const gross_weight = allCartProd[item["item_code"]]['Gross Weight'] ? allCartProd[item["item_code"]]['Gross Weight'] : 0;
    const net_weight = allCartProd[item["item_code"]]['Gross Weight'] ? allCartProd[item["item_code"]]['Gross Weight'] : 0;
    const gen_posting = allCartProd[item["item_code"]]['Gen_ Prod_ Posting Group'] ? allCartProd[item["item_code"]]['Gen_ Prod_ Posting Group'] : ' ';
    const vat_posting = allCartProd[item["item_code"]]['VAT Prod_ Posting Group'] ? allCartProd[item["item_code"]]['VAT Prod_ Posting Group'] : ' ';


    queryString =
      [1, incrementedId ,line_no ,orderInfo['Sell-to Customer No_'] ,2
      , item["item_code"] ,'DKMB','INV-FG', formatDate(new Date()) + " 00:00:00", item["item_name"]
      , item["item_name"] ,'Pieces', item["quantity"] , item["quantity"] , item["quantity"]
      , item["quantity"] , item["unit_price"] , item["cost_price"] , item["VAT"] ,0
      ,0, item["total"] , item["total_inc_VAT"] ,1, gross_weight 
      , net_weight ,0,0,' ',' '
      ,' ',' ',' ',' ',' '
      , item["total_inc_VAT"] ,0,0,0,0
      ,' ',0,0, orderInfo['Sell-to Customer No_'] ,0
      ,' ',0,0, bus_posting , gen_posting
      ,0,' ',' ',0,' '
      ,' ',' ',' ',' ',0
      ,' ',' ', bus_posting , vat_posting , currency 
      , item["total_inc_VAT"] ,0,0,1,' '
      ,0, item["total"] ,0,' ', item["total"] 
      ,0,0, vat_identifier ,0,' '
      ,0,0,0,0,0
      ,0,0,0,' ',' '
      ,0,' ',0,0,0
      ,0,0,0,0,0
      ,0,0,0,0,0
      ,0,0,' ',0,' '
      ,'1753-01-01 00:00:00.000', item["size"] ,' ',1,0
      ,'PCS', item["quantity"] , item["quantity"] , item["quantity"] , item["quantity"] 
      ,0,0,0,'1753-01-01 00:00:00.000',' '
      ,0,' ',' ',0,' ',0
      ,' ',' ',' ',' ',0
      ,' ',0,'INVENTORY',' ',0
      ,' ',0,0,'1753-01-01 00:00:00.000','1753-01-01 00:00:00.000'
      ,' ',' ','1753-01-01 00:00:00.000','1753-01-01 00:00:00.000',' '
      ,' ',' ',1,0,0
      ,0,0,0,0,0
      ,0,' ',' ',0,' '
      ,'0',1,' ',0,' '
      ,0,0,' ', allCartProd[item["item_code"]]['WHT Product Posting Group'] ,0]

    insertQuery.push(queryString)

    line_no = line_no + 10000;

  })


  //addSLQuery += insertQuery.join(',');

  try {

    dbConnection.query(addSHQuery+ ` ${insertSalesHData.map(a => '(?)').join(',')};`, {
      replacements: insertSalesHData,
      type: Sequelize.QueryTypes.INSERT
    });

    dbConnection.query(addSLQuery+ ` ${insertQuery.map(a => '(?)').join(',')};`, {
      replacements: insertQuery,
      type: Sequelize.QueryTypes.INSERT
    });

    //await dbConnection.query(addSHQuery);
 //   await dbConnection.query(addSLQuery);

    if (orderInfo.new_shipping)
      addnewShipping(orderInfo)

    const logo = process.env.APP_URL + "/resources/uploads/company/" + company['Company Logo'];

    await orderConfirmation(orderInfo,cart_items,logo,company);
    
    // return await Models[process.env.BC_DB_NAME + '$No_ Series Line'].update({ 'Last No_ Used': incrementedId }, {
    //   where: {
    //     'Series Code': 'SO'
    //   }
    // });

  } catch (error) {
    throw new Error(error); 
  }
 
}

const addnewShipping = async (orderInfo) => {


  var code = orderInfo["Ship-to Name"].split(' ')[0];

  [error, company] = await to(
    Models[process.env.BC_DB_NAME + "$Ship-to Address"].findByPk(code, { raw: true })
  );

  if (company.Code == code) {
    code = code + '1'
  }

  const query = "INSERT INTO [dbo].[" + process.env.BC_DB_NAME + "$Ship-to Address]" +
    "([Customer No_]" +
    ",[Code]" +
    ",[Name]" +
    ",[Name 2]" +
    ",[Address]" +
    ",[Address 2]" +
    ",[City]" +
    ",[Contact]" +
    ",[Phone No_]" +
    ",[Telex No_]" +
    ",[Shipment Method Code]" +
    ",[Shipping Agent Code]" +
    ",[Place of Export]" +
    ",[Country_Region Code]" +
    ",[Last Date Modified]" +
    ",[Location Code]" +
    ",[Fax No_]" +
    ",[Telex Answer Back]" +
    ",[GLN]" +
    ",[Post Code]" +
    ",[County]" +
    ",[E-Mail]" +
    ",[Home Page]" +
    ",[Tax Area Code]" +
    ",[Tax Liable]" +
    ",[Shipping Agent Service Code]" +
    ",[Service Zone Code])" +
    "VALUES" +
    "('" + orderInfo["Sell-to Customer No_"] + "'" +
    ",'" + code + "'" +
    ",'" + orderInfo["Ship-to Name"] + "'" +
    ",' '" +
    ",'" + orderInfo["Ship-to Address"] + "'" +
    ",'" + orderInfo["Ship-to Address 2"] + "'" +
    ",'" + orderInfo["Ship-to City"] + "'" +
    ",'" + orderInfo["Ship-to Contact"] + "'" +
    ",'" + orderInfo["Phone No_"] + "'" +
    ",' '" +
    ",' '" +
    ",' '" +
    ",' '" +
    ",'" + orderInfo["Ship-to Country_Region Code"] + "'" +
    ",'1753-01-01 00:00:00.000'" +
    ",' '" +
    ",' '" +
    ",' '" +
    ",' '" +
    ",'" + orderInfo["Ship-to Post Code"] + "'" +
    ",'" + orderInfo["Ship-to County"] + "'" +
    ",'" + orderInfo["Ship-to Email"] + "'" +
    ",'" + orderInfo["Home Page"] + "'" +
    ",' '" +
    ",0" +
    ",' '" +
    ",' ')";

  await dbConnection.query(query);

  return await Models[process.env.BC_DB_NAME + "$Customer"].update({ 'Ship-to Code': code }, { where: { No_: orderInfo["Sell-to Customer No_"] } });


}

const exchangeOrderItems = async (query) => {

  query = {
    where: { 'Document No_': query.orderNo },
    include: [{
      model: Models[process.env.BC_DB_NAME + '$Item Attributes'],
    }, {
      model: Models[process.env.BC_DB_NAME + '$Item'], attributes: ['Parent Item']
    }
    ],
    raw: true
  }


  let [error, products] = await to(
    Models[process.env.BC_DB_NAME + '$Sales Invoice Line'].findAll(query)
  );

  if (error) TE(error.message);

  let allProducts = []
  await Promise.all(

    products.map(async (product, key) => {
      let [error, variants] = await to(
        Models[process.env.BC_DB_NAME + '$Item Variant'].findAll({
          where: { 'Item No_': product.No_ },
          raw: true,
          attributes: ['Code']
        })
      );

      /* THis will check that current product is parent or not
        If Parent Item value is blank then it return as it is
        or it will return parent item */


      const parent_item = product[ process.env.BC_DB_NAME +'$Item.Parent Item'] ? product[process.env.BC_DB_NAME +'$Item.Parent Item'] : product['No_']

      let [errors, relatedItems] = await to(
        Models[process.env.BC_DB_NAME + '$Item'].findAll({
          where: { 'Parent Item': parent_item },
          attributes: ['No_'],
          raw: true,
          include: [{
            model: Models[process.env.BC_DB_NAME + '$Item Attributes'], attributes: ['Item Attribute Name', 'Attribute Image']
          }
          ],
        })
      );
      let sizes = [];
      variants.map(variant => {
        sizes.push({ label: variant.Code, key: variant.Code, value: variant.Code })
      })
      let colors = [];
      relatedItems.map(color => {
        colors.push({ label: color[process.env.BC_DB_NAME + '$Item Attribute.Item Attribute Name'], key: color['No_'], value: color['No_'] })
      })

      allProducts.push({ key: key, ...product, sizes: sizes, colorvariants: colors })

      return allProducts;

    })).then(async result => {

      console.log(allProducts);
      paginationOutPut = await CommonService.paginationOutPut(
        allProducts,
        0,
        10,
        products.count
      );

    })

  return paginationOutPut;
}

const save = async (data, user) => {

  var currentPath = process.cwd();

  let [error, company] = await to(
    Models[process.env.BC_DB_NAME + "$Customer"].findByPk(data['order']['customer_no'],
      {
        attributes: ['Company Logo'],
        raw: true
      })
  );

  const logo = process.env.APP_URL + "/resources/uploads/company/" + company['Company Logo'];

  data['order']['user_id'] = user.id;

  const order = await Models.exchange_order_requests.create(data['order']);
  let order_items = []
  //console.log('dasdws',data['order_items'][0]);
  data['order_items'].map((item, index) => {

    order_items.push({ ...item, exchange_order_id: order['id'] })
  });

  await Models.exchange_order_items.bulkCreate(order_items);

  [err, user] = await to(Models.users.findByPk(data['order']['user_id']));
  //console.log(user);
  if (err) TE(err.message);

  readHTMLFile(currentPath + '/resources/views/emails/exchangeRequest.html', function (err, html) {

    let template = handlebars.compile(html);
    var htmlToSend = template({ staff_name: user.dataValues.user_name, APP_URL: process.env.APP_URL, logo: logo });

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
      to: 'tushar.barate86@gmail.com', // Change to your recipient
      from: process.env.EMAIL_FROM, // Change to your verified sender
      subject: data['order'] == 0 ? 'Exchange Request' : 'Refund Request',
      text: 'and easy to do anywhere, even with Node.js',
      html: htmlToSend,
    }

    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
  })

}

module.exports = { placeOrder, exchangeOrderItems, save };