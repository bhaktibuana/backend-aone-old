const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs");

const UserRole = sequelize.define(
  "UserRole",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

UserRole.associate = (models) => {};

module.exports = UserRole;
