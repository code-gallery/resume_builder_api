
module.exports = (sequelize, DataTypes) => {
    const salesOrder = sequelize.define(process.env.BC_DB_NAME+'$Sales Header', {
        Quantity: DataTypes.FLOAT(38,20),
        No_:{
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        'Currency Code':DataTypes.STRING

    }, {
        freezeTableName: true,
        timestamps: false
    });

    salesOrder.associate = function (models) {
        salesOrder.belongsTo(models[process.env.BC_DB_NAME+'$Customer'], {foreignKey: 'Sell-to Customer No_'});
        salesOrder.hasMany(models[process.env.BC_DB_NAME+'$Sales Line'], {foreignKey: 'Document No_'});
      //  Company.hasMany(models.LoginToken, {foreignKey: 'company_id', as: 'relatedLoginToken'});
    }
    return salesOrder;
};