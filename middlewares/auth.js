const { User } = require("../models");
const { UnauthorizedError } = require("../errors");

const auth = async (req, res, next) => {
      if (req.session && req.session.authenticated) {
            let user = await User.findById(req.session.user._id);
            if (!user) throw new UnauthorizedError("Unauthorized");
            req.session.user = user.public;

            return next();
      }

      return res.redirect("/auth/login");
};

module.exports = auth;
