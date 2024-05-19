const express = require('express');
const router = express.Router();
const cpinventoryController = require('../controllers/company-portal/cpinventory.controller');




router.get('/inventories', cpinventoryController.getInventories);


module.exports = router;