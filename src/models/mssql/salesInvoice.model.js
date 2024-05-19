
module.exports = (sequelize, DataTypes) => {
    const salesInvoice = sequelize.define(process.env.BC_DB_NAME+'$Sales Invoice Header', {
        Quantity: DataTypes.FLOAT(38,20),
        Amount: DataTypes.FLOAT(38,20),
        No_:{
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        'Currency Code':DataTypes.STRING

    }, {
        freezeTableName: true,
        timestamps: false
    });

    salesInvoice.associate = function (models) {
        salesInvoice.belongsTo(models[process.env.BC_DB_NAME+'$Customer'], {foreignKey: 'Sell-to Customer No_'})
      //  Company.hasMany(models.LoginToken, {foreignKey: 'company_id', as: 'relatedLoginToken'});
    }
    return salesInvoice;
};