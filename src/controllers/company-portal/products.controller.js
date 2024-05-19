        const express = require("express");
        const productService = require("../../services/product.service");
        const { to, ReE, TE, ReS } = require("../../services/util.service");


        // const getAllProducts = function (req,res){
        //     console.log("getAllProducts called");

        //     jwt.verify(req.token, secretkey, (err, decode)=>{

        //         if(err){
        //             return res.send({status : "UNAUTHORIZED"})
        //         }
        //         if(decode.loggUser.id){
        //             mssql.connect(config.sandboxdb,(err)=>{
        //                 if(!err){
        //                     console.log("DB Connected");
        //                     let query_statement = `SELECT [No_],[Description],[Unit Price],[Picture] FROM [dbo].[DKMTEST16Dec19$Item]`;

        //                     mssql.query(query_statement,(resp, data) => {
        //                         for(a in data){
        //                             console.log(a);
        //                         }
        //                         res.send({msg : "getAllProducts called.......",products:data['recordset']})
        //                 })
        //                 }else{
        //                     console.log(err);
        //                 }
        //           })

        //         }
        //     })
        // }


        // const getProductDetails = function (req,res){
        //     let productObj = req.body;
        //     console.log("productObj :",productObj);

        //     jwt.verify(req.token, secretkey, (err, decode)=>{

        //         if(err){
        //             return res.send({status : "UNAUTHORIZED"})
        //         }
        //         if(decode.loggUser.id){
        //             mssql.connect(config.sandboxdb,(err)=>{
        //                 if(!err){
        //                     console.log("DB Connected");

        //                     let query_statement = `SELECT [No_],[Description],[Unit Price],[Product Description],[Size],[Color],[Picture]  FROM [dbo].[DKMTEST16Dec19$Item] WHERE [No_]='${productObj.No_}'`                  
        //                     let query_statement1= `SELECT [Variant Code], SUM(quantity) AS [Quantity] FROM [dbo].[DKMTEST16Dec19$Item Ledger Entry] WHERE [Item No_] ='${productObj.No_}' GROUP BY [Variant Code] HAVING SUM(quantity) > 0 ;`
        //                     var response;
        //                     mssql.query(query_statement,(resp, data) => {
        //                         response = data;
        //                         for(a in data){
        //                             console.log(a);
        //                         }

        //                 })
        //                 mssql.query(query_statement1,(resp, data1) => {
        //                     for(a in data1){
        //                         console.log(a);
        //                     }

        //                     res.send({msg : "Get ALL Product Details called.......",products:response['recordset'],Quantity:data1['recordset']})
        //                 })   
        //                 }else{
        //                     console.log(err);
        //                 }
        //           })

        //         }
        //     })

        // }


        const getProductByCategory = async function (req, res) {
            let err, category;
            let start = new Date();
            const productList = req.query;

            [err, data] = await to(productService.getProductByCategoryList(productList));
            if (err) return ReE(res, err, 200);
            return ReS(res, {
                message: "Successful",
                response: data,
            }, 200, start);
        }

        const getProductDetail = async function (req, res) {
            let err, category;
            let start = new Date();
            const requestData = req.query;

            [err, data] = await to(productService.getProductDetailList(requestData));
            if (err) return ReE(res, err, 200);
            return ReS(res, {
                message: "Successful",
                response: data,
            }, 200, start);
        }

        const getSimilarProduct = async function (req, res) {
            let err, category;
            let start = new Date();
            const requestData = req.query;

            [err, data] = await to(productService.getSimilarProductList(requestData));
            if (err) return ReE(res, err, 200);
            return ReS(res, {
                message: "Successful",
                response: data,
            }, 200, start);
        }

        const getPopularProduct = async function (req, res) {
            let err, category;
            let start = new Date();
            const requestData = req.query;

            [err, data] = await to(productService.getPopularProductList(requestData));
            if (err) return ReE(res, err, 200);
            return ReS(res, {
                message: "Successful",
                response: data,
            }, 200, start);
        }


        const getProductHistory = async function (req, res) {

            let err;
            let start = new Date();
            const productInfo = req.query;
            [err, productHistory] = await to(productService.getProductHistory(productInfo));
            if (err) return ReE(res, err, 200);

            return ReS(res, productHistory, 200, start);
        };

        const securePayment= async function (req,res){
            let err, category;
            let start = new Date();
            const requestData = req.body;
            
            //console.log("uerid>>"+req.user.id);
        
            [err, data] = await to(productService.securePaymentList(requestData,req));
            if (err) return ReE(res, err, 200);
            return ReS(res,{
                response: data,
                },200,start);
        }
        



        module.exports = { getProductByCategory, getProductDetail, getSimilarProduct, getPopularProduct, getProductHistory, securePayment }
