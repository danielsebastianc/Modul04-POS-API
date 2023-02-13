const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  hashPassword: (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  },
  createToken: (payload, expired = "24h") => {
    let token = jwt.sign(payload, process.env.TOKEN_KEY, {
      expiresIn: expired,
    });
    return token;
  },
  readToken: (req, res, next) => {
    // pengecekan tokennya dulu baru ke keeplogin
    jwt.verify(req.token, process.env.TOKEN_KEY, (err, decrypt) => {
      if (err) {
        console.log(err);
        return res.status(401).send({
          success: false,
          message: "Token Authentication Failed",
        });
      }
      console.log("TOKEN DECRYPTION:", decrypt);
      req.decrypt = decrypt; // menampung data hasil terjemahan token
      next();
    });
  },
};
