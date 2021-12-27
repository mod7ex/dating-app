const { auth, guest } = require("../middlewares");

class Router {
      router = null;
      auth;
      guest;

      constructor() {
            this.auth = auth;
            this.guest = guest;
      }
}

module.exports = Router;
