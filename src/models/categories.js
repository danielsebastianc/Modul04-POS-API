const { Sequelize } = require("sequelize");
const { dbSeq } = require("../config/db");

const { DataTypes } = Sequelize;

const CategoriesModel = dbSeq.define("categories", {
  idcategories: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
});

module.exports = CategoriesModel;
