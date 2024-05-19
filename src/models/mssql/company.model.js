

module.exports = (sequelize, DataTypes) => {
  const DKM$Customer = sequelize.define(process.env.BC_DB_NAME + '$Customer', {

    Name: DataTypes.STRING,
    NO_: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
    ABN:{
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false
    },
    'Phone No_': DataTypes.STRING,
    'Customer Type': DataTypes.STRING,
    'CUSTOMER GROUP': DataTypes.STRING,
    'COMPANY LOGO': DataTypes.STRING,
    'COMPANY Banner Image': DataTypes.STRING,
    'VAT Registration No_': DataTypes.STRING,
    'Contact': DataTypes.STRING,
    'ABN': DataTypes.INTEGER,
    'E-Mail': DataTypes.STRING,
    'Address': DataTypes.STRING,
    'Address 2': DataTypes.STRING,
    'Home Page': DataTypes.STRING,
    'City': DataTypes.STRING,
    'Post Code': DataTypes.STRING,
    'County': DataTypes.STRING,
    'Country_Region Code': DataTypes.STRING,
    'Currency Code': DataTypes.STRING,
    'Currency Id': DataTypes.INTEGER,
    'Ship-to Code': DataTypes.STRING,
    'Minimum Order Fee':DataTypes.STRING,
    'Website Payment Type':DataTypes.STRING    


  }, {
    freezeTableName: true,
    timestamps: false
  });

  DKM$Customer.associate = function (models) {
    // User.belongsTo(models.users, {foreignKey: 'customer_no'});
    DKM$Customer.belongsTo(models[process.env.BC_DB_NAME+'$Ship-to Address'], {foreignKey: 'Ship-to Code'});
  }

  // Company.beforeSave(async (company, options) => {
  //     let err;
  // })

  return DKM$Customer;
};