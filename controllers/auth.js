const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { UnauthorizedError } = require("../errors");

class AuthController {
      static getLogin(req, res, next) {
            res.render("auth/login");
      }

      static async login(req, res, next) {
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

            res.session.authenticated = true;
            res.session.user = user.public;

            res.status(StatusCodes.OK).redirect("/profile");
      }

      static getRegister(req, res, next) {
            res.render("auth/register");
      }

      static async register(req, res, next) {
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

            res.session.authenticated = true;
            res.session.user = user.public;

            res.status(StatusCodes.CREATED).redirect("/profile");
      }

      static async logout(req, res, next) {
            let user = await User.findById(req.body.id);

            if (!user) throw new UnauthorizedError("Unauthorized");

            req.session.destroy();

            res.status(StatusCodes.OK).redirect("/");
      }
}

module.exports = AuthController;
