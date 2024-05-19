/**
 * Author: Tuli Kumari
 * Page Content: Category API
 */
 
const {to, TE} = require('../services/util.service');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const { query } = require("express");
const { forEach } = require("lodash");
const { TEXT } = require("sequelize");
const _ = require('lodash');
const CommonService= require('../services/common.service');
const dbConnection = require("../data/database/db");

const getAllCategoriesList = async (categoryList) => {

    if (_.isEmpty(categoryList)) TE("Params are not set");
   
    let keyword = "";
    if(categoryList.keyword)   
        keyword = categoryList.keyword;

    let customer_no = "";
    if(categoryList.customer_no)   
        customer_no = categoryList.customer_no;
                  
                           let rawQuery ="SELECT  ItemWiseCategory.[Category],"+
                           "CONCAT('"+process.env.APP_URL + "/resources/uploads/category/',MC.[Banner]) Category_image, MC.[Description] Category_name," +
                           "(select COUNT(IWC.[Item No_]) from ["+process.env.BC_DB_NAME+"$Item wise Category] as IWC  WHERE IWC.[Category]=ItemWiseCategory.[Category] AND IWC.[Category]!='' AND IWC.[Customer No_]='"+customer_no+"' GROUP by IWC.[Category] ) as Item, "+
                           "ISNULL((select COUNT(Item.[No_]) from ["+process.env.BC_DB_NAME+"$Item] as Item where Item.[Parent Item] in "+
                           "(select IWC2.[Item No_] from ["+process.env.BC_DB_NAME+"$Item wise Category] as IWC2  WHERE IWC2.[Category]=ItemWiseCategory.[Category] AND IWC2.[Category]!='' AND IWC2.[Customer No_]='"+customer_no+"')),0) as Sub_Item "+
                           "FROM  ["+process.env.BC_DB_NAME+"$Item wise Category] AS ItemWiseCategory "+
                           "INNER JOIN [DKMTEST16Dec19$Master Category] as MC ON MC.[Code]=ItemWiseCategory.[Category] "+
                           "WHERE ItemWiseCategory.[Customer No_]='"+customer_no+"'  AND ItemWiseCategory.[Category]!='' ";
                           if (categoryList.keyword)
                           rawQuery += " AND MC.[Description] LIKE '%" + categoryList.keyword + "%' ";
                           rawQuery +="GROUP BY ItemWiseCategory.[Category], ItemWiseCategory.[Customer No_], MC.[Banner], MC.[Description]";


                    try {
                        const result = await dbConnection.query(rawQuery);
                        return result[0];

                  } catch (error) {
                    if (error) TE(error.message);
                  }

}

const getAllSubCategoriesList = async (subCategoryList) => {

  if (_.isEmpty(subCategoryList)) TE("Params are not set");
 
  let customer_no = "";
  if(subCategoryList.customer_no)   
  customer_no = subCategoryList.customer_no;

  let category = "";
  if(subCategoryList.category)   
    category = subCategoryList.category;


                let rawQuery ="SELECT ItemWiseCategory.[Level 1],ItemWiseCategory.[Level 2],ItemWiseCategory.[Level 3]"+
                              " FROM ["+process.env.BC_DB_NAME+"$Item wise Category] AS ItemWiseCategory where ItemWiseCategory.[Customer No_]='"+customer_no+"' and ItemWiseCategory.[Category]='"+category+"'";


                  try {
                      const result = await dbConnection.query(rawQuery);
                      
                      let subCategoryVal = "";
                      result[0].forEach(data => {
                        if(data['Level 1']) subCategoryVal += "\'"+data['Level 1']+"\',";
                        if(data['Level 2']) subCategoryVal += "\'"+data['Level 2']+"\',";
                        if(data['Level 3']) subCategoryVal += "\'"+data['Level 3']+"\',";
                      })
                      subCategoryVal = subCategoryVal.substring(0, subCategoryVal.length - 1);
                      

                      let rawQuery1 ="select MSC.[Code], MSC.[Description] from [DKMTEST16Dec19$Master Sub Category] as MSC  WHERE MSC.[Code] in ("+subCategoryVal+")";
                      try {
                       const result1 = await dbConnection.query(rawQuery1);

                       let rawQuery3 ="SELECT  ItemWiseCategory.[Category],"+
                           "CONCAT('"+process.env.APP_URL + "/resources/uploads/category/',MC.[Banner]) Category_image, MC.[Description] Category_name," +
                           "(select COUNT(IWC.[Item No_]) from ["+process.env.BC_DB_NAME+"$Item wise Category] as IWC  WHERE IWC.[Category]=ItemWiseCategory.[Category] AND IWC.[Category]!='' AND IWC.[Customer No_]='"+customer_no+"' GROUP by IWC.[Category] ) as Item, "+
                           "ISNULL((select COUNT(Item.[No_]) from ["+process.env.BC_DB_NAME+"$Item] as Item where Item.[Parent Item] in "+
                           "(select IWC2.[Item No_] from ["+process.env.BC_DB_NAME+"$Item wise Category] as IWC2  WHERE IWC2.[Category]=ItemWiseCategory.[Category] AND IWC2.[Category]!='' AND IWC2.[Customer No_]='"+customer_no+"')),0) as Sub_Item "+
                           "FROM  ["+process.env.BC_DB_NAME+"$Item wise Category] AS ItemWiseCategory "+
                           "INNER JOIN [DKMTEST16Dec19$Master Category] as MC ON MC.[Code]=ItemWiseCategory.[Category] "+
                           "WHERE ItemWiseCategory.[Customer No_]='"+customer_no+"' AND ItemWiseCategory.[Category]='"+category+"'  AND ItemWiseCategory.[Category]!='' ";
                           rawQuery3 +="GROUP BY ItemWiseCategory.[Category], ItemWiseCategory.[Customer No_], MC.[Banner], MC.[Description]";
                       const result3 = await dbConnection.query(rawQuery3);
                       //result1[0][0].category = result3[0];

                       //return result1[0];

                       let resulData = {
                        message: "Successful",
                        response: result1[0],
                        category: result3[0][0]
                       }
                       return resulData;
                      } catch (error) {
                        if (error) TE(error.message);
                      }
                } catch (error) {
                  if (error) TE(error.message);
                }

}


module.exports = { getAllCategoriesList, getAllSubCategoriesList};