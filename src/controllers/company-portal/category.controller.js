const express = require("express");
const categoryService = require("../../services/category.service");
const { to, ReE, TE, ReS } = require("../../services/util.service");

// const getCategories = function (req,res){
//     let categoryObj = req.body;
//     console.log("CategoryObj :",categoryObj);

//     jwt.verify(req.token, secretkey, (err, decode)=>{
     
//         if(err){
//             return res.send({status : "UNAUTHORIZED"})
//         }
//         if(decode.loggUser.id){
//             mssql.connect(config.sandboxdb,(err)=>{
//                 if(!err){
//                     console.log("DB Connected");
//                     let query_statement
//                     console.log("categoryObj.Parent_Category :",categoryObj['Parent Category']);
//                     if(categoryObj['Parent Category']){
//                         query_statement = `SELECT * FROM [dbo].[DKMTEST16Dec19$Item Category] WHERE [Parent Category]='${categoryObj['Parent Category']}'`                  
//                     }else{
//                         query_statement = `SELECT * FROM [dbo].[DKMTEST16Dec19$Item Category]`;
//                     }
//                     mssql.query(query_statement,(resp, data) => {
//                         res.send({msg : "Get ALL Subcategoires called.......",childCategories:data['recordset']})
//                 })
//                 }else{
//                     console.log(err);
//                 }
//           })
            
//         }
//     })
    
// }


const getAllCategories = async function (req,res){      
    let err, category;
    let start = new Date();
    const categoryList = req.query;
    
    [err, category] = await to(categoryService.getAllCategoriesList(categoryList));
    if (err) return ReE(res, err, 200);
    return ReS(res,{
        message: "Successful",
        response: category,
        },200,start);
}

const getAllSubCategories= async function (req,res){
    let err, category;
    let start = new Date();
    const subcategoryList = req.query;
    
    [err, category] = await to(categoryService.getAllSubCategoriesList(subcategoryList));
    if (err) return ReE(res, err, 200);
    return ReS(res,category,200,start);
}


module.exports={getAllCategories, getAllSubCategories}