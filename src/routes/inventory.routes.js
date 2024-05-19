const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/super-admin/inventory.controller');




router.get('/inventories', inventoryController.getInventories);


module.exports = router;