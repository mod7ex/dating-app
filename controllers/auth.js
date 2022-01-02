const User = require("../models/User");
const { UnauthorizedError, BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
require("dotenv").config();

const Controller = require("./controller");

class AuthController extends Controller {
      constructor() {
            super();
      }

      getLogin(req, res, next) {
            super.render(req, res, next, "auth/login");
      }

      async login(req, res, next) {
            let { email_username, password } = req.body;

            if (!email_username || !password)
                  throw new UnauthorizedError("please provide correct data");

            let user = await User.findOne({
                  $or: [
                        { email: email_username },
                        { username: email_username },
                  ],
            });

            if (!user) throw new UnauthorizedError("user not found");

            let isValid = await user.checkPassword(password);

            if (!isValid) throw new UnauthorizedError("invalid password");

            req.session.authenticated = true;
            req.session.user = user.public;

            super.redirect(req, res, next, "/users/me");
      }

      getRegister(req, res, next) {
            super.render(req, res, next, "auth/register");
      }

      async register(req, res, next) {
            const {
                  first_name,
                  last_name,
                  username,
                  email,
                  password,
                  password_confirmation,
            } = req.body;

            if (!password)
                  throw new BadRequestError("please provide a password");

            if (!password_confirmation || password != password_confirmation)
                  throw new BadRequestError("please confirm your password");

            let user = await User.create({
                  first_name,
                  last_name,
                  username,
                  email,
                  password,
            });

            req.session.authenticated = true;
            req.session.user = user.public;

            super.redirect(
                  req,
                  res,
                  next,
                  "/users/me?edit=true",
                  StatusCodes.CREATED
            );
      }

      async logout(req, res, next) {
            let user = await User.findById(req.session.user._id);

            if (!user) throw new UnauthorizedError("Unauthorized");

            req.session.destroy();

            res.clearCookie(process.env.SESSION_COOKIE_NAME);

            super.redirect(req, res, next, "/");
      }
}

module.exports = AuthController;
