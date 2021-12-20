const auth = async (req, res, next) => {
      if (req.session && req.session.authenticated) {
            return next();
      }

      return res.redirect("/auth/login");
};

module.exports = auth;
