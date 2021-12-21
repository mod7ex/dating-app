const auth = require("../middlewares/auth");

class Router {
      router = null;
      auth;

      constructor() {
            this.auth = auth;
      }
}

module.exports = Router;
