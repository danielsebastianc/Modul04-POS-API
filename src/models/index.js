const UsersModel = require("./users");
const ProductsModel = require("./products");
const CategoriesModel = require("./categories");
const TransactionModel = require("./transactions");
const TransactionDetailModel = require("./transactions_detail");

UsersModel.hasMany(TransactionModel, { foreignKey: "idusers" });
TransactionModel.belongsTo(UsersModel, { as: "user", foreignKey: "idusers" });

CategoriesModel.hasMany(ProductsModel, { foreignKey: "idcategories" });
ProductsModel.belongsTo(CategoriesModel, { as: "category", foreignKey: "idcategories" });

TransactionModel.hasMany(TransactionDetailModel, { foreignKey: "idtransactions" });
TransactionDetailModel.belongsTo(TransactionModel, {
  as: "transaction",
  foreignKey: "idtransactions",
});

ProductsModel.hasMany(TransactionDetailModel, { foreignKey: "idproducts" });
TransactionDetailModel.belongsTo(ProductsModel, { as: "product", foreignKey: "idproducts" });

module.exports = {
  UsersModel,
  ProductsModel,
  CategoriesModel,
  TransactionModel,
  TransactionDetailModel,
};
