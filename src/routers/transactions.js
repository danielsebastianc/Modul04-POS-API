const route = require("express").Router();
const { transactions } = require("../controllers");

route.get("/all", transactions.getData);
route.post("/", transactions.newTransaction);
route.patch("/:idtransactions", transactions.update);
route.get("/detail/:idtransactions", transactions.getTransactionDetail);
route.get("/", transactions.pagination);

module.exports = route;
