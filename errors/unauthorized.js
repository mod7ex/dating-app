const CustomAPIError = require("./custom-api");
const { StatusCodes } = require("http-status-codes");

class UnauthorizedError extends CustomAPIError {
      constructor(message = "Unauthorized") {
            super(message);
            this.statusCode = StatusCodes.UNAUTHORIZED;
      }
}

module.exports = UnauthorizedError;
