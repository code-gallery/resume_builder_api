const express = require('express');
const router = express.Router();

const cartController = require('../controllers/company-portal/cart.controller');

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


router.get('/summary',cartController.getCartDetails);
router.post('/save',cartController.saveToCart)
router.post('/checkQtyAndShip',ensureToken,cartController.checkout)
router.delete('/emptyCart', cartController.emptyCart);
module.exports = router;
