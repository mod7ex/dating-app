const CustomAPIError = require("./custom-api");
const { StatusCodes } = require("http-status-codes");

class UnauthorizedError extends CustomAPIError {
      constructor(message = "Unauthorized", _render = false) {
            super(message);
            this.render = _render;
            this.statusCode = StatusCodes.UNAUTHORIZED;
      }
}

module.exports = UnauthorizedError;
