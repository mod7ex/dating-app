const { NotFoundError } = require("../errors");

const notFoundMiddleware = (req, res, next) => {
      next(new NotFoundError("Page not found !", true));
};

module.exports = notFoundMiddleware;
