
module.exports = (sequelize, DataTypes) => {
    const ProductItem = sequelize.define(process.env.BC_DB_NAME+'$Item Attributes', {
         'Item No_':{ type: DataTypes.STRING, primaryKey: true },
         'Item Attribute Name': DataTypes.STRING,
         'Attribute Image':DataTypes.STRING
       
    }, {
        freezeTableName: true,
        timestamps: false
    });

    ProductItem.associate = function (models) {
       // ProductItem.hasMany(models[process.env.BC_DB_NAME+'$Customer'], {foreignKey: 'Sell-to Customer No_'});
    }
   // salesOrder.belongsTo(DKM$Customer,{foreignKey: 'Sell-to Customer No_', as:'customer'});

    // Company.beforeSave(async (company, options) => {
    //     let err;
    // })

    return ProductItem;
};