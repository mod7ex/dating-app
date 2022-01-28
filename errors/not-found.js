const CustomAPIError = require("./custom-api");
const { StatusCodes } = require("http-status-codes");

class NotFoundError extends CustomAPIError {
      constructor(message = "Not found", _render = false) {
            super(message);
            this.redner = _render;
            this.statusCode = StatusCodes.NOT_FOUND;
      }
}

module.exports = NotFoundError;
