const { StatusCodes } = require("http-status-codes");
const { Controller } = require("../controllers");

let controller = new Controller();

const notFoundMiddleware = (req, res, next) => {
      controller.render(req, res, next, "404");
      // res.status(StatusCodes.NOT_FOUND).render("404");
};

module.exports = notFoundMiddleware;
