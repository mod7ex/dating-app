const auth = require("./auth");
const requestMiddleware = require("./request");
const notFoundMiddleware = require("./not-found");
const errorHandlerMiddleware = require("./error-handler");

module.exports = {
      auth,
      requestMiddleware,
      notFoundMiddleware,
      errorHandlerMiddleware,
};
