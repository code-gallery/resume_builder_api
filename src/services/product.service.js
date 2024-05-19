/**
 * Author: Tuli Kumari
 * Page Content: Product API
 */

const { to, TE } = require('../services/util.service');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { query } = require("express");
const { forEach } = require("lodash");
const { TEXT } = require("sequelize");
const _ = require('lodash');
const CommonService = require('../services/common.service');
const dbConnection = require("../data/database/db");
const https = require('https');
const sha1 = require('sha1');
const axios = require('axios');
const nodeBase64 = require('nodejs-base64-converter');
const CircularJSON = require('circular-json');
const { Console } = require('console');
const Models = require('../models/model')



const getProductByCategoryList = async (productList) => {

    if (_.isEmpty(productList)) TE("Params are not set");

    let customer_no = "";
    if (productList.customer_no)
        customer_no = productList.customer_no;

    let category = "";
    if (productList.category)
        category = productList.category;

    let subcategory = "";
    if (productList.subcategory)
        subcategory = productList.subcategory;

    //Sort  by
    let orderValue = productList.sortByOrder == 1 ? "ASC" : "DESC"
    let orderType = productList.sortByColumn == 1 ? "[Description]" : "[Unit Price]"


    // let rawQuery = "SELECT ITEM.[No_], ITEM.[Description], ITEM.[Unit Price], IA.[Attribute Image] FROM ["+process.env.BC_DB_NAME+"$Item] AS ITEM, ["+process.env.BC_DB_NAME+"$Item Attributes] AS IA WHERE IA.[Item No_] = ITEM.[No_] AND ITEM.[Parent Item] = '' AND ITEM.[No_] in";
    // rawQuery +="(SELECT STRING_AGG(IWC.[Item No_],',') FROM ["+process.env.BC_DB_NAME+"$Item wise Category] AS IWC where IWC.[Customer No_]='"+customer_no+"' and IWC.[Category]='"+category+"'";
    // if(subcategory) {
    //   rawQuery +=" AND (IWC.[Level 1]='"+subcategory+"' || IWC.[Level 2]='"+subcategory+"' || IWC.[Level 3]='"+subcategory+"')";
    // }
    //rawQuery +=" )";
    //rawQuery +=" AND CU.[No_]='"+customer_no+"' AND CU.[Customer Group]=ITEM.[Product Website Code]";

    let rawQuery = "SELECT ITEM.[No_], ITEM.[Description], ITEM.[Unit Price], CONCAT('" + process.env.APP_URL + "/resources/uploads/items/',IA.[Attribute Image]) as Attribute_Image, CU.[Currency Code], ISNULL(SLD.[Line Discount _],0) as Discount";
    rawQuery += " FROM "
    rawQuery += " [" + process.env.BC_DB_NAME + "$Customer] AS CU,";
    rawQuery += " [" + process.env.BC_DB_NAME + "$Item] AS ITEM";
    rawQuery += " left JOIN [" + process.env.BC_DB_NAME + "$Sales Line Discount] AS SLD ON ITEM.[No_] = SLD.[Code]";
    rawQuery += " left JOIN [" + process.env.BC_DB_NAME + "$Item Attributes] AS IA ON IA.[Item No_] = ITEM.[No_] ";
    rawQuery += " WHERE ITEM.[Parent Item] = '' AND ITEM.[No_] in ";
    rawQuery += "(SELECT IWC.[Item No_] FROM [" + process.env.BC_DB_NAME + "$Item wise Category] AS IWC where IWC.[Customer No_]='" + customer_no + "' and IWC.[Category]='" + category + "'";
    if (subcategory) {
        rawQuery += " AND (IWC.[Level 1]='" + subcategory + "' OR IWC.[Level 2]='" + subcategory + "'OR IWC.[Level 3]='" + subcategory + "')";
    }
    rawQuery += " )";
    rawQuery += " AND CU.[No_]='" + customer_no + "' AND CU.[Customer Group]=ITEM.[Product Website Code] ";



    if (productList.keyword)
        rawQuery += " AND (ITEM.[No_] LIKE '%" + productList.keyword + "%' OR  ITEM.[Description] LIKE '%" + productList.keyword + "%') ";

    if (productList.sortByOrder)
        rawQuery += " ORDER BY ITEM." + orderType + " " + orderValue;

    try {
        const result = await dbConnection.query(rawQuery);
        return result[0];

    } catch (error) {
        if (error) TE(error.message);
    }

}



const getProductDetailList = async (productList) => {

    if (_.isEmpty(productList)) TE("Params are not set");

    let customer_no = "";
    if (productList.customer_no)
        customer_no = productList.customer_no;

    let item_no = "";
    if (productList.item_no)
        item_no = productList.item_no;
    // let productQuery = "SELECT ITEM.[Product Description] FROM [" + process.env.BC_DB_NAME + "$Item] AS ITEM WHERE [No_]='ADC001' ";
    // let resultQuery = await dbConnection.query(productQuery);
    // console.log("hellllllooooo",resultQuery[0][0]["Product Description"]);
    let rawQuery = "SELECT ITEM.[No_], ITEM.[Description], ITEM.[Unit Price], CONCAT('" + process.env.APP_URL + "/resources/uploads/items/',IA.[Attribute Image]) as Attribute_Image, CU.[Currency Code],ITEM.[Product Description], ";
    rawQuery += " ISNULL(SLD.[Line Discount _],0) as Discount, IA.[Item Attribute Name] as color, ";
    rawQuery += " (SELECT [Variant Code], SUM(quantity) AS [Quantity]";
    rawQuery += " FROM [dbo].[" + process.env.BC_DB_NAME + "$Item Ledger Entry]  where [Item No_]='" + item_no + "' GROUP BY [Variant Code] FOR JSON PATH) as [Variant]";
    rawQuery += " FROM ";
    rawQuery += " [" + process.env.BC_DB_NAME + "$Customer] AS CU, [" + process.env.BC_DB_NAME + "$Item] AS ITEM  ";
    rawQuery += " left JOIN [" + process.env.BC_DB_NAME + "$Sales Line Discount] AS SLD ON ITEM.[No_] = SLD.[Code]  ";
    rawQuery += " left JOIN [" + process.env.BC_DB_NAME + "$Item Attributes] AS IA ON IA.[Item No_] = ITEM.[No_] ";
    rawQuery += " WHERE ITEM.[No_]  ";
    rawQuery += " in ('" + item_no + "') AND CU.[No_]='" + customer_no + "' AND CU.[Customer Group]=ITEM.[Product Website Code]";


    // let rawQuery1 = "SELECT ITEM.[No_], IA.[Item Attribute Name] as color ";
    // rawQuery1 += " FROM [" + process.env.BC_DB_NAME + "$Customer] AS CU, [" + process.env.BC_DB_NAME + "$Item] AS ITEM  ";
    // rawQuery1 += " left JOIN [" + process.env.BC_DB_NAME + "$Item Attributes] AS IA ON IA.[Item No_] = ITEM.[No_] ";
    // rawQuery1 += " WHERE ITEM.[Parent Item] = '"+item_no+"' AND CU.[No_]='" + customer_no + "' AND CU.[Customer Group]=ITEM.[Product Website Code]";




    let selectParentQuery = "SELECT [Parent Item] from  [" + process.env.BC_DB_NAME + "$Item] where [No_]='" + item_no + "'";

    try {
        const result = await dbConnection.query(rawQuery);

        const parentResult = await dbConnection.query(selectParentQuery);
        //console.log(parentResult[0][0]["Parent Item"]);
        let childElement = '0';
        if (parentResult[0][0]["Parent Item"] != '') {
            let selectSiblingQuery = "SELECT STRING_AGG([No_],',') No_ from  [" + process.env.BC_DB_NAME + "$Item] where [Parent Item]='" + parentResult[0][0]["Parent Item"] + "' AND [No_]!='" + item_no + "'";
            const selectSiblingResult = await dbConnection.query(selectSiblingQuery);
            //console.log(parentResult[0][0]["Parent Item"]+','+selectSiblingResult[0][0]["No_"]);
            childElement = parentResult[0][0]["Parent Item"] + ',' + selectSiblingResult[0][0]["No_"];
        }
        else {
            let selectChildQuery = "SELECT count([No_]) countval,STRING_AGG([No_],',') as NO_ from  [" + process.env.BC_DB_NAME + "$Item] where [Parent Item]='" + item_no + "'";
            const selectChildRequest = await dbConnection.query(selectChildQuery);
            if (selectChildRequest[0][0]["countval"] > 0) {
                //console.log(selectChildRequest [0][0]["NO_"]);
                childElement = selectChildRequest[0][0]["NO_"];
            }
        }
        console.log("1111>>>>" + childElement);

        console.log("2222>>>>" + childElement);

        if (childElement != 0) {
            childElement = "'" + childElement.split(",").join("','") + "'";
            let rawQuery1 = "SELECT ITEM.[No_], IA.[Item Attribute Name] as color ";
            rawQuery1 += " FROM [" + process.env.BC_DB_NAME + "$Customer] AS CU, [" + process.env.BC_DB_NAME + "$Item] AS ITEM  ";
            rawQuery1 += " left JOIN [" + process.env.BC_DB_NAME + "$Item Attributes] AS IA ON IA.[Item No_] = ITEM.[No_] ";
            rawQuery1 += " WHERE ITEM.[No_] in (" + childElement + ") ";
            rawQuery1 += " AND CU.[No_]='" + customer_no + "' AND CU.[Customer Group]=ITEM.[Product Website Code]";
            const result1 = await dbConnection.query(rawQuery1);
            result[0][0].child_item = result1[0];
        } else {
            console.log(">>>>>>++++++++++++");
            result[0][0].child_item = [];
        }
        return result[0];


    } catch (error) {
        if (error) TE(error.message);
    }

}

const getSimilarProductList = async (productList) => {

    if (_.isEmpty(productList)) TE("Params are not set");

    let customer_no = "";
    if (productList.customer_no)
        customer_no = productList.customer_no;

    let item_no = "";
    if (productList.item_no)
        item_no = productList.item_no;

    let rawQuery = "SELECT ITEM.[No_], ITEM.[Description], ITEM.[Unit Price], CONCAT('" + process.env.APP_URL + "/resources/uploads/items/',IA.[Attribute Image]) as Attribute_Image, CU.[Currency Code], ISNULL(SLD.[Line Discount _],0) as Discount";
    rawQuery += " FROM "
    rawQuery += " [" + process.env.BC_DB_NAME + "$Customer] AS CU,";
    rawQuery += " [" + process.env.BC_DB_NAME + "$Item] AS ITEM";
    rawQuery += " left JOIN [" + process.env.BC_DB_NAME + "$Sales Line Discount] AS SLD ON ITEM.[No_] = SLD.[Code]";
    rawQuery += " left JOIN [" + process.env.BC_DB_NAME + "$Item Attributes] AS IA ON IA.[Item No_] = ITEM.[No_] ";
    rawQuery += " WHERE ITEM.[Parent Item] = '' AND ITEM.[No_] in ";
    rawQuery += " (SELECT IWC.[Item No_] FROM [" + process.env.BC_DB_NAME + "$Item wise Category] AS IWC where IWC.[Customer No_]='" + customer_no + "' and IWC.[Category] in ";
    rawQuery += " (SELECT IWC2.[Category] from [" + process.env.BC_DB_NAME + "$Item wise Category] AS IWC2 where IWC2.[Item No_]='" + item_no + "'))";
    rawQuery += " AND CU.[No_]='" + customer_no + "' AND CU.[Customer Group]=ITEM.[Product Website Code]";

    // console.log(rawQuery);

    try {
        const result = await dbConnection.query(rawQuery);
        return result[0];

    } catch (error) {
        if (error) TE(error.message);
    }

}

const getPopularProductList = async (productList) => {

    if (_.isEmpty(productList)) TE("Params are not set");

    let customer_no = "";
    if (productList.customer_no)
        customer_no = productList.customer_no;

    let item_no = "";

    let rawQuery = "SELECT DISTINCT ITEM.[No_], ITEM.[Description], ITEM.[Unit Price], CONCAT('"+process.env.APP_URL + "/resources/uploads/items/',IA.[Attribute Image]) as Attribute_Image, CU.[Currency Code], ISNULL(SLD.[Line Discount _],0) as Discount";
    rawQuery += " FROM "
    rawQuery += " [" + process.env.BC_DB_NAME + "$Customer] AS CU,";
    rawQuery += " [" + process.env.BC_DB_NAME + "$Item] AS ITEM";
    rawQuery += " left JOIN [" + process.env.BC_DB_NAME + "$Sales Line Discount] AS SLD ON ITEM.[No_] = SLD.[Code]";
    rawQuery += " left JOIN [" + process.env.BC_DB_NAME + "$Item Attributes] AS IA ON IA.[Item No_] = ITEM.[No_] ";
    rawQuery += " WHERE ITEM.[Parent Item] = '' AND ITEM.[No_] in ";
    rawQuery += " (select SIL.[No_] from [dbo].[" + process.env.BC_DB_NAME + "$Sales Invoice Line] as SIL where SIL.[Sell-to Customer No_] = '" + customer_no + "' AND SIL.[Shipment Date] >=  Dateadd(Month, Datediff(Month, 0, DATEADD(m, -6, current_timestamp)), 0) GROUP BY SIL.[No_],SIL.[Shipment Date] ORDER BY SIL.[Shipment Date] DESC OFFSET 0 ROWS)";
    rawQuery += " AND CU.[No_]='" + customer_no + "' AND CU.[Customer Group]=ITEM.[Product Website Code]  ORDER BY ITEM.[Unit Price] DESC OFFSET 0 ROWS  FETCH NEXT 10 ROWS ONLY";

    // console.log(rawQuery);

    try {
        const result = await dbConnection.query(rawQuery);
        return result[0];

    } catch (error) {
        if (error) TE(error.message);
    }

}

function pad2(n) { return n < 10 ? '0' + n : n }

const securePaymentList = async (productList, req) => {
    console.log("productList>>>" + JSON.stringify(productList));

    let user_id = req.user.id
    console.log("uerid>>>" + user_id);

    //ENCRYPTED DATA
    // let card_Number = "NDQ0NDMzMzMyMjIyMTExMQ==";
    // let expiration_Month = "MDg=";
    // let expiration_Year = "MjAyMw==";
    // let security_code = "MTIz";

    //DUMMY DATA
    // let card_Number = "4444333322221111";
    // let expiration_Month = "08";
    // let expiration_Year = "2023";
    // let security_code = "123";
    // let customer_no = "C0004431";

    let card_Number = "";
    if (productList.card_Number) {
        card_Number = productList.card_Number;
       // card_Number = nodeBase64.urlDecode(card_Number);
    }
    let expiration_Month = "";
    if (productList.expiration_Month) {
        expiration_Month = productList.expiration_Month;
       // expiration_Month = nodeBase64.urlDecode(expiration_Month);
    }

    let expiration_Year = "";
    if (productList.expiration_Year) {
        expiration_Year = productList.expiration_Year;
      //  expiration_Year = nodeBase64.urlDecode(expiration_Year);
    }

    let security_code = "";
    if (productList.security_code) {
        Security_code = productList.security_code;
       // security_code = nodeBase64.urlDecode(security_code);
    }

    let order_amount = "";
    if (productList.order_amount)
        order_amount = productList.order_amount
    order_amount = parseFloat(order_amount).toFixed(2);

    let ReferenceNo = Math.floor(Date.now() / 1000);

    var date = new Date();
    const data = date.getUTCFullYear().toString() + pad2(date.getUTCMonth() + 1) + pad2(date.getUTCDate()) + pad2(date.getUTCHours()) + pad2(date.getUTCMinutes()) + pad2(date.getUTCSeconds());
    let hashVal = process.env.MERCHANTID + "|" + process.env.TRANSACTIONPASSWORD + "|0|DKM" + ReferenceNo + "|" + order_amount + "|" + data;
    hashVal = sha1(hashVal);

    let customer_no = "";
    if (productList.customer_no)
        customer_no = productList.customer_no;



    let param = 'EPS_MERCHANT=' + process.env.MERCHANTID;
    param += '&EPS_TXNTYPE=0';
    param += '&EPS_AMOUNT=' + order_amount;
    param += '&EPS_TIMESTAMP=' + data;
    param += '&EPS_FINGERPRINT=' + hashVal;
    param += '&EPS_REDIRECT=true';
    param += '&EPS_RESULTURL=https://company.dkmblue.adcreatorsdemo.com.au/';
    param += '&EPS_REFERENCEID=DKM' + ReferenceNo;
    param += '&EPS_CARDNUMBER=' + card_Number;
    param += '&EPS_EXPIRYMONTH=' + expiration_Month;
    param += '&EPS_EXPIRYYEAR=' + expiration_Year;
    param += '&EPS_CCV=123' + security_code;

    // console.log("https://test.api.securepay.com.au/directpost/authorise?"+param);

    try {
        const result = await axios.post("https://test.api.securepay.com.au/directpost/authorise?" + param);

        // console.log(CircularJSON.stringify(result));
        let returnUrl = result.request._redirectable._currentUrl;
        returnUrl = returnUrl.split('?')[1];
        const urlParams = new URLSearchParams(returnUrl);
        const params = Object.fromEntries(urlParams);

        //console.log(">>>>"+result.request._redirectable._currentUrl)
        return Models.payment_details.create({
            user_id: user_id,
            customer_no: customer_no,
            order_amount: order_amount,
            updatedAt: params.timestamp,
            restext: params.restext,
            refid: params.refid,
            summarycode: params.summarycode,
            rescode: params.rescode,
            txnid: params.txnid,
            createdAt: params.timestamp,
        }).then(function (payments) {
            if (payments) {
                return params;
            } else {
                response.status(400).send('Error in insert new record');
            }
        });

        //  return params;


    } catch (error) {
        if (error) TE(error.message);
        return {};
    }
}

const getProductHistory = async (productInfo) => {
    let limit = 10;
    productQuery = {
        where: {},
        raw: true,
    };

    productQuery.limit = limit;
    if (_.isEmpty(productInfo)) TE("Params are not set");
    let page = productInfo.pageNumber != 0 ? productInfo.pageNumber : 1;
    productQuery.offset = (page - 1) * limit;
    productQuery.raw = true;
    productQuery.where['Item No_'] = productInfo.item_no;

    let [err, product] = await to(
        Models[process.env.BC_DB_NAME + "$Item Ledger Entry"].findAndCountAll(productQuery)
    );
    if (err) TE(err.message);
    paginationOutPut = await CommonService.paginationOutPut(
        product.rows,
        page,
        limit,
        product.count
    );
    return paginationOutPut;
};


module.exports = { getProductByCategoryList, getProductDetailList, getSimilarProductList, getPopularProductList, securePaymentList, getProductHistory };
