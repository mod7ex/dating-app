var methodOverride = require("method-override");

// override with POST having _method in the request body
let methodOverrideMiddleware = methodOverride(function (req, res) {
      if (req.body && typeof req.body === "object" && "_method" in req.body) {
            // look in urlencoded POST bodies and delete it
            var method = req.body._method;
            delete req.body._method;
            return method;
      }
});

module.exports = methodOverrideMiddleware;
