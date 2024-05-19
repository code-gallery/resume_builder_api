
module.exports = (sequelize, DataTypes) => {
    const valueEntryTable = sequelize.define(process.env.BC_DB_NAME+'$Value Entry', {
        
       
    }, {
        freezeTableName: true,
        timestamps: false
    });

    valueEntryTable.associate = function (models) {
        valueEntryTable.belongsTo(models[process.env.BC_DB_NAME+'$Item'], {foreignKey: 'Item No_'})
        // placeOrderTable.belongsTo(models[process.env.BC_DB_NAME+'$Item Attributes'], {foreignKey: 'No_', As:'fdf'})
    }
   // salesOrder.belongsTo(DKM$Customer,{foreignKey: 'Sell-to Customer No_', as:'customer'});

    // Company.beforeSave(async (company, options) => {
    //     let err;
    // })

    return valueEntryTable;
};