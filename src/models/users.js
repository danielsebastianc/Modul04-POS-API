const { Sequelize } = require("sequelize");
const { dbSeq } = require("../config/db");

const { DataTypes } = Sequelize;

const UsersModel = dbSeq.define(
  "users",
  {
    idusers: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "unverified",
    },
  },
  {
    timestamps: false,
  }
);

module.exports = UsersModel;
