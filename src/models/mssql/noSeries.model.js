module.exports = (sequelize, DataTypes) => {
    const NoSeries = sequelize.define(process.env.BC_DB_NAME+'$No_ Series Line', {
       
        'Series Code': {
            type: DataTypes.STRING,
            primaryKey: true
          },
        'Last No_ Used':  DataTypes.STRING,
       
    }, {
        freezeTableName: true,
        timestamps: false
    });

    NoSeries.associate = function (models) {
      //  Company.hasMany(models.LoginToken, {foreignKey: 'company_id', as: 'relatedLoginToken'});
    }

    // Company.beforeSave(async (company, options) => {
    //     let err;
    // })

    return NoSeries;
};