const { UnauthorizedError, BadRequestError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const Controller = require("./controller");

class GenericController extends Controller {
      constructor() {
            super();
      }

      home(req, res, next) {
            super.render(req, res, next, "home");
      }

      error(req, res, next, payload, title = "Error Occurred") {
            res.locals.page_title = title;
            super.render(req, res, next, "error", payload);
      }
}

module.exports = GenericController;
