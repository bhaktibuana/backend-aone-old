const { Sequelize } = require("sequelize");
const config = require("./app.config");

const dbConfig = (dbName) => {
  const dbParams = {
    host: config.dbHost,
    username: config.dbUsername,
    password: config.dbPassword,
    dbName,
  };

  return new Sequelize(dbParams.dbName, dbParams.username, dbParams.password, {
    host: dbParams.host,
    dialect: "mysql",
    port: parseInt(config.dbPort),
    logging: config.nodeEnv === "production" ? false : console.log,
  });
};

const db = dbConfig(config.dbName);

module.exports = db;
