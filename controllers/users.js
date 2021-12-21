const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { UnauthorizedError, NotFoundError } = require("../errors");

class UserController {
      static async index(req, res, next) {
            let users = await User.find({});

            res.status(StatusCodes.OK).render("user/listing", users);
      }

      static async show(req, res, next) {
            let user = await User.findById(req.params.id);

            if (!user) throw new NotFoundError("User not found");

            res.status(StatusCodes.OK).render("user/profile", user);
      }

      static async edit(req, res, next) {
            let user = await User.findById(req.session.user._id);

            if (!user) throw new UnauthorizedError("Unauthorized");

            res.status(StatusCodes.OK).render("user/my-profile", user);
      }

      static async update(req, res, next) {
            let user = await User.findByIdAndUpdate(
                  req.session.user._id,
                  req.body,
                  {
                        new: true,
                  }
            );

            if (!user) throw new UnauthorizedError("Unauthorized");

            req.session.user = user.public;

            res.status(StatusCodes.OK).redirect("back");
      }

      static async destroy(req, res, next) {
            let user = await User.findByIdAndDelete(req.session.user._id);

            if (!user) throw new UnauthorizedError("Unauthorized");

            req.session.destroy();

            res.status(StatusCodes.OK).redirect("/");
      }
}

module.exports = UserController;
