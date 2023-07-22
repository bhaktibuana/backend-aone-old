const { DataTypes } = require("sequelize");
const { sequelize } = require("../configs");

const UserLogin = sequelize.define(
  "UserLogin",
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
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    device: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    otpToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

UserLogin.associate = (models) => {
  UserLogin.belongsTo(models.User, {
    foreignKey: "userId",
  });
};

module.exports = UserLogin;
