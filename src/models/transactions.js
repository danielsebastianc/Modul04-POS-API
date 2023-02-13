const { Sequelize } = require("sequelize");
const { dbSeq } = require("../config/db");

const { DataTypes } = Sequelize;

const TransactionModel = dbSeq.define("transactions", {
  idtransactions: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  idusers: {
    type: DataTypes.INTEGER,
  },
  orderId: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
  },
  notes: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
});

module.exports = TransactionModel;
