const { readToken } = require("../config/encrypt");
const { checkUser } = require("../config/validator");
const { users } = require("../controllers");
const route = require("express").Router();

route.post("/login", users.login);
route.post("/regis", checkUser, users.regis);
route.get("/keep", readToken, users.keepLogin);
route.get("/all", users.getData);
route.patch("/:idusers", users.update);
route.get("/search", users.filterUser);
route.get("/", users.paginate);

module.exports = route;
