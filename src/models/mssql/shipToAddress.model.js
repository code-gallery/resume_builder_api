
module.exports = (sequelize, DataTypes) => {
    const salesOrder = sequelize.define(process.env.BC_DB_NAME+'$Ship-to Address', {
        'Customer No_': DataTypes.STRING,
        Code:{
            type: DataTypes.STRING,
            primaryKey: true
        },
        Name: DataTypes.STRING,
        Address: DataTypes.STRING,
        'Address 2': DataTypes.STRING,
        'Phone No_': DataTypes.STRING,
        'Country_Region Code': DataTypes.STRING,
        'Post Code': DataTypes.STRING,
        'County': DataTypes.STRING,
        'E-Mail': DataTypes.STRING,
        'Name': DataTypes.STRING,

        

    }, {
        freezeTableName: true,
        timestamps: false
    });

    salesOrder.associate = function (models) {
        // salesOrder.belongsTo(models[process.env.BC_DB_NAME+'$Customer'], {foreignKey: 'Sell-to Customer No_'});
        // salesOrder.hasMany(models[process.env.BC_DB_NAME+'$Sales Line'], {foreignKey: 'Document No_'});
      //  Company.hasMany(models.LoginToken, {foreignKey: 'company_id', as: 'relatedLoginToken'});
    }
    return salesOrder;
};