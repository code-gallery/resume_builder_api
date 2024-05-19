module.exports = (sequelize, DataTypes) => {
  const RefundReturn = sequelize.define("exchange_order_items",{
    id: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      old_item_no: { type: DataTypes.STRING,allowNull: true },
      old_color: {  type: DataTypes.STRING ,allowNull: true },
      old_size: DataTypes.STRING,
      
      new_item_no:{type: DataTypes.STRING,allowNull: true },
      color: {  type: DataTypes.STRING ,allowNull: true },
      reason: DataTypes.STRING,
      size: DataTypes.STRING,
      quantity_return: DataTypes.INTEGER,
      quantity_ordered: DataTypes.INTEGER,
      exchange_order_id: DataTypes.INTEGER,
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      }
    },
  );

  RefundReturn.associate = function (models) {
  //  RefundReturn.belongsTo(models.users, {foreignKey: 'user_id'});
  };

  
  return RefundReturn;
};
