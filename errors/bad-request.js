const CustomAPIError = require("./custom-api");
const { StatusCodes } = require("http-status-codes");

class BadRequestError extends CustomAPIError {
      constructor(message = "Bad request", _render = false) {
            super(message);
            this.render = _render;
            this.statusCode = StatusCodes.BAD_REQUEST;
      }
}

module.exports = BadRequestError;
