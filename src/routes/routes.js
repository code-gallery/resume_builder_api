const companyRoutes = require('./superAdmin.routes');
const userRoutes = require('./user.routes');
const productRoutes = require('./products.routes');
const authRoutes = require('./auth.routes');
const cartRoutes = require('./cart.routes');
const categoriesRoutes = require('./categories.routes');
const inventoryRoutes = require('./inventory.routes');
const placeOrderRoutes = require('./placeOrder.routes');
const cpinventoryRoutes = require('./cpinventory.routes');



module.exports = (app) => {
    app.use('/api/v1/superAdmin', companyRoutes);
    app.use('/api/v1/user', userRoutes);
    app.use('/api/v1/companyPortal/product', productRoutes);
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/companyPortal/cart', cartRoutes);
    app.use('/api/v1/companyPortal/category', categoriesRoutes);
    app.use('/api/v1/superAdmin/inventory', inventoryRoutes);
    app.use('/api/v1/companyPortal/orders', placeOrderRoutes);
    app.use('/api/v1/companyPortal/inventory', cpinventoryRoutes);

}