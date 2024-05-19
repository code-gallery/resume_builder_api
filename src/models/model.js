const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || "development";

const config = require(`${__dirname}/../config/config.js`)[env];
const db = {};
const databases = Object.keys(config.databases);

/** Add Databases**/
for (let i = 0; i < databases.length; ++i) {
  let database = databases[i];
  let dbPath = config.databases[database];

  db[database] = new Sequelize(
    dbPath.database,
    dbPath.username,
    dbPath.password,
    {
      host: dbPath.host,
      port: dbPath.port,
      dialect: dbPath.dialect,
      operatorAliases: false,
    }
  );
}

/**Add the Database Models**/

//Add models from
fs.readdirSync(__dirname + "/mssql")
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    const model = require(path.join(__dirname + "/mssql", file))(db.mssql,Sequelize);
    db[model.name] = model;
  });

fs.readdirSync(__dirname + "/mysql")
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    const model = require(path.join(__dirname + "/mysql", file))(db.mysql,Sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


module.exports = db;
