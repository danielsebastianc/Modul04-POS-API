const route = require("express").Router();
const { categories } = require("../controllers");

route.get("/all", categories.getData);
route.post("/regis", categories.regis);

module.exports = route;
