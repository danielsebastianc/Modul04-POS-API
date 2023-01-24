const { checkUser } = require("../config/validator");
const { users } = require("../controllers");
const route = require("express").Router();

route.post("/login", users.login);
route.post("/regis", checkUser, users.regis);

module.exports = route;
