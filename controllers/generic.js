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

      search(req, res, next) {
            super.render(req, res, next, "search");
      }
}

module.exports = GenericController;
