const { Sequelize } = require("sequelize");
const { dbSeq } = require("../config/db");

const { DataTypes } = Sequelize;

const TransactionDetailModel = dbSeq.define(
  "transaction_details",
  {
    idtransaction_detail: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idtransactions: {
      type: DataTypes.INTEGER,
    },
    idproducts: {
      type: DataTypes.INTEGER,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
    },
  },
  {
    timestamps: false,
  }
);

module.exports = TransactionDetailModel;
