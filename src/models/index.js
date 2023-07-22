const { Op } = require("sequelize");
const { sequelize } = require("../configs");

const models = {
  Op: Op,
  sequelize: sequelize,
  UserRole: require("./userRole.model"),
  User: require("./user.model"),
  UserLogin: require("./userLogin.model"),
  UserRepo: require("./userRepo.model"),
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = models;
