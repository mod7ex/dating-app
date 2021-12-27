const UnauthorizedError = require("./unauthorized");
const BadRequestError = require("./bad-request");
const CustomAPIError = require("./custom-api");
const NotFoundError = require("./not-found");
const InternalServerError = require("./internal-server-error");

module.exports = {
      UnauthorizedError,
      BadRequestError,
      CustomAPIError,
      NotFoundError,
      InternalServerError,
};
