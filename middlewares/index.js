const auth = require("./auth");
const guest = require("./guest");
const csrfProtection = require("./csurf");
const requestMiddleware = require("./request");
const notFoundMiddleware = require("./not-found");
const errorHandlerMiddleware = require("./error-handler");

module.exports = {
      auth,
      guest,
      csrfProtection,
      requestMiddleware,
      notFoundMiddleware,
      errorHandlerMiddleware,
};