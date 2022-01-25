const { StatusCodes } = require("http-status-codes");

class CustomAPIError extends Error {
      constructor(
            message = "Something went wrong, please try again later",
            _render = false
      ) {
            super(message);
            this.render = _render;
            this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      }
}

module.exports = CustomAPIError;
