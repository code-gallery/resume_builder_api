

module.exports = (sequelize, DataTypes) => {
    const inventory = sequelize.define(process.env.BC_DB_NAME+'$Item Ledger Entry', {
       
        Quantity: DataTypes.INTEGER,
        'Item No_': DataTypes.STRING,
        'Entry No_': { type: DataTypes.INTEGER, primaryKey: true },
        
       
    }, {
        freezeTableName: true,
        timestamps: false
    });

    inventory.associate = function (models) {
        //.hasMany(models.CompanyRelatedChild, {foreignKey: 'user_id', as: 'relatedUsers'});
      //  Company.hasMany(models.LoginToken, {foreignKey: 'company_id', as: 'relatedLoginToken'});
    }

    // Company.beforeSave(async (company, options) => {
    //     let err;
    // })

    return inventory;
};