const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs");

const UserRepo = sequelize.define(
  "UserRepo",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    apiKey: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

UserRepo.associate = (models) => {
  UserRepo.belongsTo(models.User, {
    foreignKey: "userId",
  });
};

module.exports = UserRepo;
