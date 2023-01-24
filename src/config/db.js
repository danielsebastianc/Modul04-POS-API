const { Sequelize } = require("sequelize");

const dbSeq = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
});

const CheckConnection = async () => {
  try {
    await dbSeq.authenticate();
    console.log(`Connected to Sequelize`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { dbSeq, CheckConnection };
