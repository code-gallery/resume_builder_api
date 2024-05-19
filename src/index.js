const express = require("express");
const app = express();
const CONFIG = require("./config/config");
const {mysql} = require("./models/model");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDefinition = require("../swagger/swaggerconfig");
const cors = require('cors');
const bodyParser = require("body-parser");

const path = require('path');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Init Middleware
app.use(express.json({ extended: false }));

app.use('/resources/uploads', express.static(path.join('resources', 'uploads')));
app.use('/resources/assets', express.static(path.join('resources', 'assets')));

/**
 * Swagger Config
 */
 const optionsroute = {
     swaggerDefinition,
     explorer: true,
     apis: ['./swagger/*.js'],
 };

 const swaggerDocs = swaggerJsDoc(optionsroute);
 app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

 //Log Enviornment
 console.log("Enviornment:", process.env.NODE_ENV);
 
/** 
 * Db connection
 */
mysql
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully :", mysql.options.dialect);
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });


const port = parseInt(CONFIG.port, 10) || 5000;

//routes(self calling function)
require('./routes/routes')(app);


app.listen(port, () => {
  console.log("Server is up on port 5000.");
});

module.exports = { app};