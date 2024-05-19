const express = require('express');
const router = express.Router();
const placeOrderController = require('../controllers/company-portal/placeOrder.controller');


const auth = require("../middleware/auth");

router.post('/placeOrder',auth,placeOrderController.placeOrder);
router.get('/history',  placeOrderController.orderHistory);
router.get('/invoice',  placeOrderController.orderInvoice);
router.get('/exchange',  placeOrderController.exchangeOrder);
router.post('/save', auth, placeOrderController.save);


module.exports = router;