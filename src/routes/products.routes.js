const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");


const productsController = require('../controllers/company-portal/products.controller');

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

// router.get('/getAllProducts',ensureToken, productsController.getAllProducts);
// router.post('/getProductDetails', ensureToken,productsController.getProductDetails);

router.get('/getProductByCategory',productsController.getProductByCategory);
router.get('/getProductDetail',productsController.getProductDetail);
router.get('/getSimilarProduct',productsController.getSimilarProduct);
router.get('/getPopularProduct',productsController.getPopularProduct);
router.post('/securePayment',auth,productsController.securePayment);

router.get('/productHistory', productsController.getProductHistory);


module.exports = router
