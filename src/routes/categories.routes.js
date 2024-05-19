const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/company-portal/category.controller');

const ensureToken = (req, res, next) => {
    const bearerToken = req.headers['authorization'];
    if(bearerToken !== undefined){
        const tokenArray = bearerToken.split(" ");
        const token = tokenArray[1];
        req.token = token;
        next();
    }else{
        res.send({
            status : "TOKEN_NOT_AVAILABLE"
        })
    }
}

//router.post('/getCategories',ensureToken, categoryController.getCategories);


router.get('/getAllCategories', categoryController.getAllCategories);
router.get('/getAllSubCategories', categoryController.getAllSubCategories);

module.exports = router
