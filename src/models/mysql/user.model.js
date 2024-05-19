const bcrypt = require('bcrypt');
const { to, TE, ReE, readHTMLFile } = require('../../services/util.service');


module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
    userid: {
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    customer_no: DataTypes.STRING,
    parent_customer_no: DataTypes.STRING,
    first_name: DataTypes.STRING,
    user_name: DataTypes.STRING,
    last_name: { type: DataTypes.STRING, allowNull: true },
    password: DataTypes.STRING,
    email: {
      allowNull: true,
      unique: true,
      type: DataTypes.STRING(255),
    },
    locations: {
      allowNull: true,
      type: DataTypes.JSON,
    },
    role: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    mobile: {
      allowNull: true,
      type: DataTypes.STRING(50),
    },
    profileimage: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    credit_issued: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    credit_remaining: {
      allowNull: true,
      type: DataTypes.STRING,
    },
    expiry_date: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    merchant_id: DataTypes.STRING,
    merchent_password: DataTypes.STRING,
  },
  );

  User.beforeSave(async (user, options) => {
    console.log("hello usermodel");
    let err;
    if (user.changed('password')) {
      let salt, hash
      [err, salt] = await to(bcrypt.genSalt(10));
      if (err) TE(err.message, true);

      [err, hash] = await to(bcrypt.hash(user.password, salt));
      if (err) TE(err.message, true);
      user.password = hash;
    }
  });

  User.associate = function (models) {
    User.belongsTo(models[process.env.BC_DB_NAME + '$Customer'], { foreignKey: 'customer_no' });
    // User.hasOne(models.user_credits, { foreignKey: 'user_id' });
  };


  return User;
};
