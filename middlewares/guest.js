const guest = async (req, res, next) => {
      if (req.session && !req.session.authenticated) {
            return next();
      }

      return res.redirect("/");
};

module.exports = guest;
