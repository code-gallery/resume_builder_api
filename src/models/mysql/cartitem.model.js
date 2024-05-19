module.exports = (sequelize, DataTypes) => {
    
    const cart_items = sequelize.define(
      "cart_items",
      {
        cart_id: {
          allowNull: false,
          autoIncrement: true,
          type: DataTypes.INTEGER,
          primaryKey: true,
        },
        customer_no: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        item_code: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        item_name: DataTypes.STRING,
        item_image: DataTypes.STRING,
        size: {
          allowNull: true,
          type: DataTypes.INTEGER,
        },
        color: {
          allowNull: true,
          type: DataTypes.INTEGER,
        },
        quantity: {
          allowNull: true,
          type: DataTypes.INTEGER,
        },
        unit_price: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        cost_price: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        stock: {
          allowNull: true,
          type: DataTypes.INTEGER,
        },
        ship_now: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        back_order: {
          allowNull: true,
          type: DataTypes.INTEGER,
        },
        currency_code: DataTypes.STRING,
        converted_value: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        total: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        VAT: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        total_inc_VAT: {
          allowNull: true,
          type: DataTypes.STRING,
        },
        status: {
          allowNull: true,
          type: DataTypes.INTEGER,
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
        },
      },
      {}
    );
  
    cart_items.associate = function (models) {
      // Company.hasMany(models.CompanyRelatedChild, {foreignKey: 'user_id', as: 'relatedUsers'});
      // Company.hasMany(models.LoginToken, {foreignKey: 'company_id', as: 'relatedLoginToken'});
    };
  
    return cart_items;
  };
  