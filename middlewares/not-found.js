const { StatusCodes } = require("http-status-codes");

const notFoundMiddleware = (req, res, next) => {
      res.status(StatusCodes.NOT_FOUND).render("404");
};

module.exports = notFoundMiddleware;
