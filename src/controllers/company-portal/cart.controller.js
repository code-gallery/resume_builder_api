const express = require("express");
var mysql = require("mysql");
var mssql = require("mssql");
const jwt = require("jsonwebtoken");
var secretkey = "SOMESECRET";
var config = require('../../config/config')
const cartService = require("../../services/cart.service");
const Models = require('../../models/model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { to, ReE, TE, ReS } = require('../../services/util.service');
const { query } = require('winston');
const { sequelize } = require("../../models/model");

// const getCartDetails = function (req, res) {
//     console.log("cart called");
//     var connection = mysql.createConnection(config.Local_DB_Config);
//     connection.connect((err) => {
//         console.log("Error :- ", err);
//         let query_statement = `SELECT * FROM dkmdatabase.cart;`;
//         connection.query(query_statement, (resp, data) => {
//             res.send({ msg: "cart called.......", data })
//         });
//     });
// }

const saveToCart = async (req, res) => {
    let err, cartDetails;
    let start = new Date();
    const cartInfo = req.body;
    console.log("cartbody", cartInfo);
    // [err, cartDetails] = await to (cartService.createCartSummary(cartInfo));
    // if (err) return ReE(res, err, 200);
    // return ReS(res, {
    //   message: "Cart Summary Created Successfully"
    // }, 200, start);
    if (cartInfo[0].type == 0) {
        [err, cartDetails] = await to(cartService.createCartSummary(cartInfo));
        if (err) return ReE(res, err, 200);
        msg = "Cart Summary Created Successfully";
    } else if (cartInfo[0].type == 1) {
        [err, cartDetails] = await to(cartService.updateCartSummary(cartInfo));
        if (err) return ReE(res, err, 200);
        msg = "Cart Summary Updated successfully";
    } else if (cartInfo[0].type == 2) {
        [err, cartDetails] = await to(cartService.deleteCartSummary(cartInfo));
        if (err) return ReE(res, err, 200);
        msg = "Cart Summary Deleted successfully";
    } else {
        TE("Somthing wrent wrong");
    }
    return ReS(res, {
        message: msg,
    }, 200, start);
}


const getCartDetails = async function (req, res) {

    let err;
    let start = new Date();
    const cartDetails = req.query;
    [err, cart] = await to(cartService.getCartDetails(cartDetails));
    if (err) return ReE(res, err, 200);
    return ReS(res, {
        message: "Successful",
        response: cart
    }, 200, start);
};

const checkoutDetails = async function (req, res) {
    let err;
    let start = new Date();
    const checkout = req.query;
    [err, summary] = await to(cartService.getCheckoutDetails(checkoutDetails));
    if (err) return ReE(res, err, 200);
    return ReS(res, {
        message: "Successful",
        response: summary
    }, 200, start);
};



// const addToCart = function (req, res) {
//     let obj = req.body
//     console.log(obj);
//     var connection = mysql.createConnection(config.Local_DB_Config);
//     connection.connect((err) => {
//         // let query_statement = `INSERT INTO dkmdatabase.cart SET 'User_id' = '${obj.User_id}','Item_code'='${obj.Item_code}','Product_name'='${obj.Product_name}','Product_image'='${obj.Product_image}','Quantity'='${obj.Quantity}','Unit_Price'='${obj.Unit_Price}','Minimum_order_fee'='${obj.Minimum_order_fee}','Status'='${obj.Status}';`
//         let query_statement = "INSERT INTO dkmdatabase.cart (`Item_code`,`Product_name`, `Quantity`, `Unit_Price`, `Minimum_order_fee`, `User_id`,`Cart_id`) VALUES ('" + obj.Item_code + "','" + obj.Product_name + "', '" + obj.Quantity + "', '" + obj.Unit_Price + "', '" + obj.Minimum_order_fee + "', '" + obj.User_id + "','" + obj.Cart_id + "'); "
//         connection.query(query_statement, (err, data) => {
//             res.send({ msg: "cart called.......", data })
//         });
//     });
// }

const checkout = function (req, res) {
    var qty = req.body;
    console.log("qty :", qty);

    jwt.verify(req.token, secretkey, (err, decode) => {

        if (err) {
            return res.send({ status: "UNAUTHORIZED" })
        }
        if (decode.loggUser.id) {
            mssql.connect(config.sandboxdb, (err) => {
                if (!err) {
                    console.log("DB Connected");
                    let Item_No = "Item No_"

                    let query_statement = `SELECT [Item No_], SUM(quantity) AS [Quantity] FROM [dbo].[DKMTEST16Dec19$Item Ledger Entry] WHERE [Item No_] ='${qty.Item_No}' GROUP BY [Item No_] HAVING SUM(quantity) > 0 ;`

                    mssql.query(query_statement, (err, data) => {
                        console.log("Data", data);
                        let availableQty;
                        let Item_code;
                        var customerGroup = "JOHN_DEERE";
                        var customerGroupArray = customerGroup.split(",");
                        Item_code = data['recordset'][0]['Item No_']
                        if (data['recordset'].length > 0) {
                            availableQty = data['recordset'][0].Quantity
                        } else {
                            availableQty = 0;
                        }
                        let shipNow;
                        let backorder;
                        let Unit_Price;
                        let subTotal;

                        if (availableQty == 0) {
                            shipNow = 0;
                            backorder = qty.buyQty
                        } else if (qty.buyQty < availableQty) {
                            shipNow = qty.buyQty
                            backorder = availableQty - qty.buyQty
                        } else if (qty.buyQty > availableQty) {
                            shipNow = availableQty
                            backorder = qty.buyQty - availableQty
                        }
                        let query_statement1 = `SELECT [No_],[Unit Price],[Product Website] FROM [dbo].[DKMTEST16Dec19$Item] WHERE [No_] = '${qty.Item_No}'`;

                        mssql.query(query_statement1, (re, da) => {
                            console.log("recordset", da['recordset']);
                            Unit_Price = da['recordset'][0]['Unit Price']
                            subTotal = da['recordset'][0]['Unit Price'] * shipNow
                            customerGroupCode = da['recordset'][0]['Product Website']
                            let minimum_order_fee = 0;
                            if (subTotal < 200) {
                                customerGroupArray.forEach(function (item, index) {
                                    console.log(item, index);
                                    if (item == customerGroupCode.toUpperCase()) {
                                        console.log(item + "  Item Found");
                                        minimum_order_fee = 20;
                                    } else {
                                        minimum_order_fee = 15;
                                        console.log(customerGroupCode + " Item not Found");
                                    }
                                });
                            }

                            da['recordset']['minimum_order_fee'] = minimum_order_fee;
                            let grandTotal = subTotal + minimum_order_fee;

                            console.log(da['recordset']);
                            var taxData = {};
                            var tax_value = 0;
                            //taxData["tax_persentage"] = "10%";
                            let currencySymbol = qty.currency;
                            let buyingQty = qty.buyQty;
                            var shipping_data = {};
                            let shipping_cost = 0;
                            console.log(currencySymbol);
                            if (currencySymbol == "AUD") {
                                shipping_data["extra_unit_charge"] = "20 cents";
                                shipping_data["extra_unit_charge_val"] = 0.20;
                                shipping_cost = (buyingQty - 1) * 0.2;
                                grandTotal = grandTotal + shipping_cost;
                                shipping_data["shipping_cost"] = shipping_cost;

                                taxData["tax_percentage"] = "10%";
                                taxData["tax_percentage_val"] = 0.1;
                                tax_value = grandTotal * 0.1;
                                taxData["tax_value"] = tax_value;

                            } else if (currencySymbol == "NZD") {
                                shipping_data["extra_unit_charge"] = "50 cents";
                                shipping_data["extra_unit_charge_val"] = 0.50;
                                shipping_cost = (buyingQty - 1) * 0.5;
                                grandTotal = grandTotal + shipping_cost;
                                shipping_data["shipping_cost"] = shipping_cost;

                                taxData["tax_percentage"] = "15%";
                                taxData["tax_percentage_val"] = 0.15;
                                tax_value = grandTotal * 0.15;
                                taxData["tax_value"] = tax_value;
                            }
                            let grandTotal_exl_tax = grandTotal;
                            da['recordset'][0]["grandTotal"] = grandTotal;
                            da['recordset'][0]['grandTotal_exl_tax'] = grandTotal;
                            let grandTotal_incl_tax = grandTotal + tax_value;
                            da['recordset'][0]['shipping_cost'] = shipping_cost;
                            da['recordset'][0]['tax_value'] = tax_value;
                            da['recordset'][0]['grandTotal_incl_tax'] = grandTotal_incl_tax;

                            res.send({ msg: "checkQtyAndShip called.......", details: { Item_code, shipNow, backorder, Unit_Price, subTotal, minimum_order_fee, shipping_cost, grandTotal, grandTotal_exl_tax, tax_value, grandTotal_incl_tax, shipping_data, taxData } })

                        })

                    })
                } else {
                    console.log(err);
                }
            })

        }
    })

}

const emptyCart = async (req, res) => {
    let err, cartDetails;
    let start = new Date();
    const cartInfo = req.query;
    console.log("cartbody", cartInfo);
    [err, cartDetails] = await to(cartService.deleteAllCartSummary(cartInfo));
    if (err) return ReE(res, err, 200);
    return ReS(res, {
        message: "Cart Summary Deleted Successfully"
    }, 200, start);
}


module.exports = { getCartDetails, saveToCart, checkout, emptyCart };




