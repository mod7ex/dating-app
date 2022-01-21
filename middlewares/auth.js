const { User } = require("../models");
const { UnauthorizedError } = require("../errors");

const auth = async (req, res, next) => {
      let session = req.session;

      if (session && session.authenticated) {
            let user = await User.findById(session.user._id);
            if (!user) throw new UnauthorizedError("Unauthorized");
            session.user = user.public;

            return next();
      }

      return res.redirect("/auth/login");
};

module.exports = auth;
