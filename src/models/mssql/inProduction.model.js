
module.exports = (sequelize, DataTypes) => {
    const inProduction = sequelize.define(process.env.BC_DB_NAME+'$DKM Production', {
        Quantity: DataTypes.STRING

    }, {
        freezeTableName: true,
        timestamps: false
    });

    inProduction.associate = function (models) {
        // salesOrder.belongsTo(models[process.env.BC_DB_NAME+'$Customer'], {foreignKey: 'Sell-to Customer No_'});
        // salesOrder.hasMany(models[process.env.BC_DB_NAME+'$Sales Line'], {foreignKey: 'Document No_'});
      //  Company.hasMany(models.LoginToken, {foreignKey: 'company_id', as: 'relatedLoginToken'});
    }
    return inProduction;
};