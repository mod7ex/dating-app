const User = require("../models/User");
const { UnauthorizedError, NotFoundError } = require("../errors");
const Controller = require("./controller");
const options = require("../helpers/data.json");

class UserController extends Controller {
      constructor() {
            super();
      }

      async index(req, res, next) {
            let users = await User.find({});

            super.render(req, res, next, "user/listing", { users });
      }

      async show(req, res, next) {
            let user = await User.findById(req.params.id);

            if (!user) throw new NotFoundError("User not found");

            super.render(req, res, next, "user/profile", { user });
      }

      async edit(req, res, next) {
            let user = await User.findById(req.session.user._id);

            if (!user) throw new UnauthorizedError("Unauthorized");

            if (req.query.edit == "true") {
                  return super.render(req, res, next, "user/my-profile-edit", {
                        user,
                        ...options,
                  });
            }

            super.render(req, res, next, "user/my-profile", { user });
      }

      async update(req, res, next) {
            console.log(req.body);

            // let user = await User.findByIdAndUpdate(
            //       req.session.user._id,
            //       req.body,
            //       {
            //             new: true,
            //       }
            // );

            // if (!user) throw new UnauthorizedError("Unauthorized");

            // req.session.user = user.public;

            super.redirect(req, res, next, "back");
      }

      async destroy(req, res, next) {
            let user = await User.findByIdAndDelete(req.session.user._id);

            if (!user) throw new UnauthorizedError("Unauthorized");

            req.session.destroy();

            super.redirect(req, res, next, "/");
      }
}

module.exports = UserController;
