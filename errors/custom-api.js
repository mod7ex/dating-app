const { StatusCodes } = require("http-status-codes");

class CustomAPIError extends Error {
      constructor(message = "Something went wrong, please try again later") {
            super(message);
            this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      }
}

module.exports = CustomAPIError;
