const { Op } = require("sequelize");
const { sequelize } = require("../configs");

const models = {
  Op: Op,
  sequelize: sequelize,
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
