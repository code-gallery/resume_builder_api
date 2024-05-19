module.exports = (sequelize, DataTypes) => {
  
  const RefundReturn = sequelize.define("exchange_order_requests",{
    id: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      order_no:DataTypes.STRING,
      customer_no: DataTypes.STRING,
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      is_approved:  DataTypes.INTEGER,
      approved_by:  DataTypes.INTEGER,
      approved_date:  DataTypes.DATE,
      
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      }
    },
  );

  RefundReturn.associate = function (models) {
    RefundReturn.belongsTo(models.users, {as:'requestedBy',foreignKey: 'user_id'}),
    RefundReturn.belongsTo(models.users, {as:'approvedBy',foreignKey: 'approved_by'})
  };

  
  return RefundReturn;
};
