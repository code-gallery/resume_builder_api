

module.exports = (sequelize, DataTypes) => {
    const inventory = sequelize.define(process.env.BC_DB_NAME + '$Item Ledger Entry', {

        'Entry No_': { type: DataTypes.INTEGER, primaryKey: true },
        'Item No_': DataTypes.STRING,
        'Posting Date': DataTypes.DATE,
        'Entry Type': DataTypes.INTEGER,
        'Document No_': DataTypes.STRING(50),
        'Quantity': DataTypes.INTEGER,
        'Remaining Quantity': DataTypes.STRING,
        'Invoiced Quantity': DataTypes.STRING

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