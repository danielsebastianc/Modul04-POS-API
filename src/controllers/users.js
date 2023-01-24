const { Sequelize } = require("sequelize");
const bcrypt = require("bcrypt");
const { hashPassword, createToken } = require("../config/encrypt");
const { UsersModel } = require("../models");

module.exports = {
  login: async (req, res) => {
    try {
      const { password, email } = req.body;
      const data = await UsersModel.findAll({
        where: {
          email: email,
        },
      });
      if (data.length < 1) {
        return res.status(403).send({
          success: false,
          message: `Email not found`,
        });
      } else {
        const check = bcrypt.compareSync(password, data[0].password);
        if (check) {
          let token = createToken({ ...data[0] });
          //kirim token dan data
          return res.status(200).send({ data: data[0], token });
        } else {
          return res.status(403).send({
            success: false,
            message: `Wrong Password`,
          });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  regis: async (req, res) => {
    try {
      const { firstName, lastName, email, phone, address, password } = req.body;
      const checkData = await UsersModel.findAll({
        where: {
          [Sequelize.Op.or]: [{ email }, { phone }],
        },
      });
      if (checkData.length > 0) {
        return res.status(300).send({
          success: false,
          message: `Account already exists`,
        });
      } else {
        let newPass = hashPassword(password);
        const data = await UsersModel.create({
          firstName,
          lastName,
          email,
          phone,
          address,
          password: newPass,
        });
        return res.status(201).send({
          success: true,
          message: `Register Successful`,
          data,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
