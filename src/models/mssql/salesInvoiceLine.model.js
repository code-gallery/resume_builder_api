
module.exports = (sequelize, DataTypes) => {
    const salesLine = sequelize.define(process.env.BC_DB_NAME+'$Sales Invoice Line', {
        'Document No_':{ type: DataTypes.STRING, primaryKey: true },
         Quantity: DataTypes.FLOAT(38,20),
         'Unit Price': DataTypes.FLOAT(38,20),
        'Sell-to Customer No_': DataTypes.STRING,
        Description: DataTypes.STRING,
        No_: DataTypes.STRING,
        'Variant Code' : DataTypes.STRING,
        'Amount Including VAT':DataTypes.FLOAT(38,20),
        'Amount':DataTypes.FLOAT(38,20),
       
    }, {
        freezeTableName: true,
        timestamps: false
    });

    salesLine.associate = function (models) {
        salesLine.belongsTo(models[process.env.BC_DB_NAME+'$Item'], {foreignKey: 'No_'}),
        salesLine.belongsTo(models[process.env.BC_DB_NAME+'$Item Attributes'], {foreignKey: 'No_'})
        salesLine.belongsTo(models[process.env.BC_DB_NAME+'$Item Variant'], {foreignKey: 'No_'})
    }
   // salesOrder.belongsTo(DKM$Customer,{foreignKey: 'Sell-to Customer No_', as:'customer'});

    // Company.beforeSave(async (company, options) => {
    //     let err;
    // })

    return salesLine;
};