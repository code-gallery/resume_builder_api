require("dotenv").config();

module.exports = {
  development: {
    databases: {
      // Special environment only for Database1
      mssql: {
        database: process.env.DB_NAME, //you should always save these values in environment variables
        username: process.env.DB_USER, //only for testing purposes you can also define the values here
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || null,
        dialect: "mssql", //here you need to define the dialect of your databse, in my case it is Postgres
      },

      // Special environment only for Database2
      mysql: {
        database: process.env.DB2_NAME,
        username: process.env.DB2_USER,
        password: process.env.DB2_PASSWORD,
        host: process.env.DB2_HOST,
        port: process.env.DB2_PORT,
        dialect: "mysql", //second database can have a different dialect
      },
    },
     "jwtSecretToken" : "mySecretToken"
  },
  JWT: {
    JWT_SECRET: "DkmBlue2020",
    JWT_SECRET_ADMIN: "DkmBlue2020-admin"
  },

};
