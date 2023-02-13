const { Sequelize } = require("sequelize");
const { CategoriesModel } = require("../models");

module.exports = {
  getData: async (req, res) => {
    try {
      const data = await CategoriesModel.findAll();
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  regis: async (req, res) => {
    try {
      const data = await CategoriesModel.create(req.body);
      return res.status(200).send({
        success: true,
        message: `New Category Added`,
        data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
