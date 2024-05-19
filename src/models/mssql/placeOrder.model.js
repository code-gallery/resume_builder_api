
module.exports = (sequelize, DataTypes) => {
    const placeOrderTable = sequelize.define(process.env.BC_DB_NAME+'$Sales Line', {
        
       
    }, {
        freezeTableName: true,
        timestamps: false
    });

    placeOrderTable.associate = function (models) {
        // placeOrderTable.belongsTo(models[process.env.BC_DB_NAME+'$Item'], {foreignKey: 'No_'}),
        // placeOrderTable.belongsTo(models[process.env.BC_DB_NAME+'$Item Attributes'], {foreignKey: 'No_', As:'fdf'})
    }
   // salesOrder.belongsTo(DKM$Customer,{foreignKey: 'Sell-to Customer No_', as:'customer'});

    // Company.beforeSave(async (company, options) => {
    //     let err;
    // })

    return placeOrderTable;
};