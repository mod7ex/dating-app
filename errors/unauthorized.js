const { CustomAPIError } = require("./");
const { StatusCodes } = require("http-status-codes");

class UnauthorizedError extends CustomAPIError {
      constructor(message) {
            super(message);
            this.statusCode = StatusCodes.UNAUTHORIZED;
      }
}

module.exports = UnauthorizedError;
