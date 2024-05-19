
module.exports = (sequelize, DataTypes) => {
    const ItemVariant = sequelize.define(process.env.BC_DB_NAME+'$Item Variant', {
         'Item No_':{ type: DataTypes.STRING, primaryKey: true },
         'Code': DataTypes.STRING,
         'Description':DataTypes.STRING
       
    }, {
        freezeTableName: true,
        timestamps: false
    });

    ItemVariant.associate = function (models) {
       // ProductItem.hasMany(models[process.env.BC_DB_NAME+'$Customer'], {foreignKey: 'Sell-to Customer No_'});
    }
   // salesOrder.belongsTo(DKM$Customer,{foreignKey: 'Sell-to Customer No_', as:'customer'});

    // Company.beforeSave(async (company, options) => {
    //     let err;
    // })

    return ItemVariant;
};