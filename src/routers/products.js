const route = require("express").Router();
const { products } = require("../controllers");
const { uploader } = require("../config/uploader");

route.get("/all", products.getData);
route.post("/regis", uploader("/productImg", "PRODUCTIMG").array("productImg", 1), products.regis);
route.patch("/:idproducts", products.update);
route.get("/", products.paginate);

module.exports = route;
