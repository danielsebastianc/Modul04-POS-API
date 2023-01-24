const { check, validationResult } = require("express-validator");

module.exports = {
  checkUser: async (req, res, next) => {
    try {
      //validation
      if (req.path == "/regis") {
        await check("firstName").notEmpty().isAlpha().run(req);
        await check("lastName").notEmpty().isAlpha().run(req);
        await check("phone").notEmpty().isAlphanumeric().run(req);
        await check("address").notEmpty().isAlphanumeric().run(req);
      }
      await check("email").notEmpty().isEmail().run(req);
      await check("password")
        .notEmpty()
        .isAlphanumeric()
        .isStrongPassword({
          minLength: 5,
          minNumbers: 1,
          minLowercase: 0,
          minUppercase: 0,
          minSymbols: 0,
        })
        .run(req);
      const validation = validationResult(req);
      console.log(`VALIDATION:`, validation);
      if (validation.isEmpty()) {
        next();
      } else {
        return res.status(400).send({
          success: false,
          message: `Validation Failed`,
          error: validation.errors,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
};
