const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const bearerToken = require("express-bearer-token");

const app = express();
const PORT = process.env.PORT || 2000;

app.use(cors());
app.use(bearerToken());
app.use(express.json());

// ROUTING LIST
const { users } = require("./src/routers");
app.use("/users", users);

// CHECK CONNECTION
const { CheckConnection } = require("./src/config/db");
CheckConnection();

app.listen(PORT, () => {
  console.log(`EXPRESS API IS RUNNING😊 PORT ${PORT}`);
});
