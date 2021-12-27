const CustomAPIError = require("./custom-api");
const { StatusCodes } = require("http-status-codes");

class InternalServerError extends CustomAPIError {
      constructor(message = "something went wrong") {
            super(message);
            this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      }
}

module.exports = InternalServerError;
