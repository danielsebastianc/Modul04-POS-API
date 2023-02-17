const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const { hashPassword, createToken } = require("../config/encrypt");
const { UsersModel } = require("../models");

module.exports = {
  paginate: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 0;
      const limit = parseInt(req.query.limit) || 10;
      const offset = limit * page;

      const { name, location, sortby } = req.query;
      const order = req.query.order || "asc";
      const filterData = [{ role: "cashier" }];
      const sortData = [];

      if (name) {
        filterData.push({
          [Op.or]: [
            {
              firstName: {
                [Op.like]: "%" + name + "%",
              },
            },
            {
              lastName: {
                [Op.like]: "%" + name + "%",
              },
            },
          ],
        });
      }
      if (location) {
        filterData.push({
          location: {
            [Op.like]: "%" + location + "%",
          },
        });
      }

      if (sortby) {
        sortData.push([sortby, order]);
      } else {
        sortData.push(["idusers", "DESC"]);
      }

      const data = await UsersModel.findAndCountAll({
        attributes: {
          exclude: ["password", "role"],
        },
        where: {
          [Op.and]: filterData,
        },
        order: sortData,
        offset: offset,
        limit: limit,
      });
      const totalPage = Math.ceil(data.count / limit);
      if (data.count > 0) {
        return res.status(200).send({
          data: data.rows,
          page,
          limit,
          totalRows: data.count,
          totalPage,
        });
      } else {
        return res.status(404).send({
          message: `Data Not Found`,
          data: [],
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  getData: async (req, res) => {
    try {
      const { name, location, sortby } = req.query;
      const order = req.query.order || "asc";
      const filterData = [{ role: "cashier" }];
      const sortData = [["idusers", "DESC"]];
      if (name) {
        filterData.push({
          [Op.or]: [
            {
              firstName: {
                [Op.like]: "%" + name + "%",
              },
            },
            {
              lastName: {
                [Op.like]: "%" + name + "%",
              },
            },
          ],
        });
      }
      if (location) {
        filterData.push({
          location: {
            [Op.like]: "%" + location + "%",
          },
        });
      }

      if (sortby) {
        sortData.push([sortby, order]);
      }

      const result = await UsersModel.findAndCountAll({
        attributes: {
          exclude: ["password", "role"],
        },
        where: {
          [Op.and]: filterData,
        },
        order: sortData,
      });
      if (result.count > 0) {
        return res.status(200).send(result);
      } else {
        return res.status(404).send({
          message: `Data Not Found`,
          data: [],
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  filterUser: async (req, res) => {
    try {
      const { name, location } = req.query;
      const data = [];
      if (name) {
        data.push({
          [Op.or]: [
            {
              firstName: {
                [Op.like]: "%" + name + "%",
              },
            },
            {
              lastName: {
                [Op.like]: "%" + name + "%",
              },
            },
          ],
        });
      }
      if (location) {
        data.push({
          location,
        });
      }
      const result = await UsersModel.findAll({
        where: {
          [Op.and]: data,
        },
      });
      if (result.length > 0) {
        return res.status(200).send(result);
      } else {
        return res.status(404).send({
          message: `Data Not Found`,
          data: [],
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
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
      const { firstName, lastName, email, phone, location, password, role } = req.body;
      const checkData = await UsersModel.findAll({
        where: {
          [Op.or]: [{ email }, { phone }],
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
          location,
          password: newPass,
          role,
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
  keepLogin: async (req, res) => {
    try {
      console.log("REQ DECRYPT", req.decrypt.dataValues);
      const data = await UsersModel.findAll({
        attributes: {
          exclude: ["password"],
        },
        where: {
          idusers: req.decrypt.dataValues.idusers,
        },
      });
      if (data.length != 1) {
        return res.status(500).send({
          success: false,
          message: `Error Loging In`,
        });
      } else {
        let token = createToken({ ...data[0] });
        return res.status(200).send({ data: data[0], token });
      }
    } catch (error) {
      console.log(error);
    }
  },
  update: async (req, res) => {
    try {
      let update = await UsersModel.update(req.body, {
        where: {
          idusers: req.params.idusers,
        },
      });
      if (update) {
        return res.status(200).send({
          success: true,
          message: `Data Updated Successfully`,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
