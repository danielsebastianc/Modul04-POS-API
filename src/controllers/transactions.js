const { Op } = require("sequelize");
const {
  TransactionModel,
  UsersModel,
  TransactionDetailModel,
  ProductsModel,
} = require("../models");

module.exports = {
  pagination: async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 5;
    const orderId = req.query.orderId || "";
    const offset = limit * page;
    const data = await TransactionModel.findAndCountAll({
      include: {
        model: UsersModel,
        as: "user",
        required: true,
        attributes: ["firstName", "lastName"],
      },
      where: {
        [Op.and]: {
          orderId: { [Op.like]: "%" + orderId + "%" },
        },
      },
      offset: offset,
      limit: limit,
      order: [["idtransactions", "DESC"]],
    });
    const totalPage = Math.ceil(data.count / limit);
    return res.status(200).send({
      data: data.rows,
      page: page,
      limit: limit,
      totalRows: data.count,
      totalPage: totalPage,
    });
  },
  getData: async (req, res) => {
    try {
      if (req.query.sortby) {
        const order = req.query.order || "asc";
        const result = await TransactionModel.findAll({
          include: {
            model: UsersModel,
            as: "user",
            required: true,
            attributes: ["firstName", "lastName"],
          },
          order: [[req.query.sortby, order]],
        });
        if (result.length > 0) {
          return res.status(200).send(result);
        } else {
          return res.status(404).send({
            message: `Data Not Found`,
            data: [],
          });
        }
      } else {
        const data = await TransactionModel.findAll({
          include: {
            model: UsersModel,
            as: "user",
            required: true,
            attributes: ["firstName", "lastName"],
          },
        });
        if (data.length > 0) {
          return res.status(200).send(data);
        } else {
          return res.status(404).send({
            message: `Data Not Found`,
            data: [],
          });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  newTransaction: async (req, res) => {
    try {
      const { idusers } = req.body;
      console.log(`REQ BODY:`, req.body);
      const getData = await TransactionModel.findAndCountAll();
      const count = getData.rows[getData.rows.length - 1].idtransactions;
      console.log(`COUNT:`, count);
      let code = "";
      if (count < 10) {
        code += `000${count + 1}`;
      } else if (count < 100) {
        code += `00${count + 1}`;
      } else if (count < 1000) {
        code += `0${count + 1}`;
      } else {
        code += `${count + 1}`;
      }
      const orderId = "BM" + code;

      const data = await TransactionModel.create({
        idusers,
        orderId,
      });

      console.log(`ID TRANSAKSI:`, data.dataValues.idtransactions);
      console.log(`DATA:`, data);

      if (data.dataValues.idtransactions) {
        for (const val of req.body.cart) {
          const { idproducts, amount, price, quantity } = val;
          const total = amount * price;
          const update = await ProductsModel.update(
            {
              quantity: quantity - amount,
            },
            {
              where: { idproducts },
            }
          );
          if (update) {
            const dataTranDetail = await TransactionDetailModel.create({
              idtransactions: data.dataValues.idtransactions,
              idproducts,
              amount,
              total,
            });
          } else {
            return res.status(500).send({
              success: false,
              message: `Theres something wrong`,
            });
          }
        }
      } else {
        return res.status(500).send({
          success: false,
          message: `Theres something wrong`,
        });
      }
      return res.status(200).send({
        success: true,
        message: `New Transaction Created`,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  update: async (req, res) => {
    try {
      let update = await TransactionModel.update(req.body, {
        where: {
          idtransactions: req.params.idtransactions,
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
  getTransactionDetail: async (req, res) => {
    try {
      let data = await TransactionDetailModel.findAll({
        where: {
          idtransactions: req.params.idtransactions,
        },
        include: [
          {
            model: TransactionModel,
            as: "transaction",
            required: true,
            include: {
              model: UsersModel,
              as: "user",
              required: true,
              attributes: ["firstName", "lastName"],
            },
          },
          {
            model: ProductsModel,
            as: "product",
            required: true,
            attributes: {
              exclude: ["quantity", "description"],
            },
          },
        ],
      });
      return res.status(200).send(data);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
