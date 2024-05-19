
module.exports = (sequelize, DataTypes) => {
    const ProductItem = sequelize.define(process.env.BC_DB_NAME+'$Item', {
         No_:{ type: DataTypes.STRING, primaryKey: true },
         'Unit Price': DataTypes.STRING,
         'Unit Cost': DataTypes.STRING,
         Description: DataTypes.STRING,
         'Product website Code':DataTypes.STRING,
         'Reorder Point': DataTypes.INTEGER,
         'Gen_ Prod_ Posting Group': DataTypes.STRING,
         'VAT Prod_ Posting Group': DataTypes.STRING,
         'Inventory Posting Group': DataTypes.STRING,
         'WHT Product Posting Group': DataTypes.STRING,
         'Gross Weight' : DataTypes.STRING,
         'Net Weight' : DataTypes.STRING

         
         
       
    }, {
        freezeTableName: true,
        timestamps: false
    });

    ProductItem.associate = function (models) {
      // ProductItem.belongsTo(models[process.env.BC_DB_NAME+'$Customer'], {foreignKey: 'Sell-to Customer No_'});
       ProductItem.hasOne(models[process.env.BC_DB_NAME+'$Item Attributes'], {foreignKey: 'Item No_'});
       ProductItem.hasMany(models[process.env.BC_DB_NAME+'$Item Variant'], {foreignKey: 'Item No_'});
    }
   // salesOrder.belongsTo(DKM$Customer,{foreignKey: 'Sell-to Customer No_', as:'customer'});

    // Company.beforeSave(async (company, options) => {
    //     let err;
    // })

    return ProductItem;
};