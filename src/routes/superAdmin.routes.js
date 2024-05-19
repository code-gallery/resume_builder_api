const express = require('express');
const router = express.Router();
const companyController = require('../controllers/super-admin/company.controller');
const inventoryController = require('../controllers/super-admin/inventory.controller');
const locationController = require('../controllers/super-admin/location.controller');
const OrderController = require('../controllers/super-admin/OrderController');
const dashboardController = require('../controllers/super-admin/dashboard.controller');
const contactUsController = require('../controllers/contactUs.controller');
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

router.get('/', (req, res) => {
    res.json({
        message: "Welcome to DKM Blue Api" 
    })
})


router.post('/company/save',upload.fields([{
    name: 'bannerImage', maxCount: 1
  }, {
    name: 'logoImage', maxCount: 1
  }]), companyController.addEditCompany);
  
router.get('/company/companies', companyController.getCompanies);
router.get('/company', companyController.getCompany);
router.get('/location/locations', companyController.getLocations);

// order routes
router.get('/salesOrder/locationPurchase', locationController.getPurchaseLocations);
router.get('/orders/pending', OrderController.getPendingOrders);
router.get('/orders/completed', OrderController.getCompletedOrders);
router.get('/orders/order', OrderController.getOrderDetail);
router.get('/order/invoice', OrderController.getOrderInvoice);
router.get('/order/SalesInvoice', OrderController.getCompletedOrderInvoice);
router.get('/order/completedOrder', OrderController.getCompletedOrderDetail);
router.get('/order/completedOrderCount', OrderController.getCompletedOrdersCount);

// Inventory routes
router.get('/inventory/soh', inventoryController.getInventories);
router.get('/inventory/lowStock', inventoryController.getLowStocks);
router.get('/inventory/inProduction', inventoryController.getInProduction);

//Refund return routes
router.get('/exchange/requests', OrderController.getExchangeRequests);
router.get('/exchange/orderDetail', OrderController.getExchangeOrderDetail);
router.post('/exchange/approve',auth,OrderController.approveExchangeOrder);


//Inventory Dashboard
router.get('/inventory/dashboard', inventoryController.dashboardList);

//contact us mail
router.post('/contactUs', contactUsController.contactUs);

//Main Dashboard
router.get('/dashboard', dashboardController.dashboardDetails);
router.get('/dashboard/totalSales', dashboardController.companySaleDetails);
router.get('/dashboard/topCompany', dashboardController.topCompanyDetails);




module.exports = router;