const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { UnauthorizedError } = require("../errors");

class AuthController {
      async login(req, res, next) {
            let { email_username, password } = req.body;

            let user = await User.findOne({
                  $or: [
                        { email: email_username },
                        { username: email_username },
                  ],
            });

            if (!user) throw new UnauthorizedError("Incorrect data");

            let isValid = await user.checkPassword(password);

            if (!isValid) throw new UnauthorizedError("Incorrect data");

            res.cookie();
            res.status(StatusCodes.OK);
      }

      async register(req, res, next) {
            const {
                  first_name,
                  last_name,
                  username,
                  email,
                  password,
                  confirmPassword,
            } = req.body;

            let user = await User.create({
                  first_name,
                  last_name,
                  username,
                  email,
                  password,
                  confirmPassword,
            });

            res.status(StatusCodes.CREATED).json({ user: user.public, token });
      }

      async logout(req, res, next) {
            let user = await User.findById(req.body.id);
      }
}

module.exports = AuthController;
