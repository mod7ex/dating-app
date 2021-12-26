const express = require("express");

const { AuthController } = require("../controllers");

const Router = require("./router");

class AuthRouter extends Router {
      constructor() {
            super();

            this.router = express.Router();
            let controller = new AuthController();

            this.router
                  .route("/login")
                  .get(controller.getLogin)
                  .post(controller.login);

            this.router
                  .route("/register")
                  .get(controller.getRegister)
                  .post(controller.register);

            this.router.post("/logout", this.auth, controller.logout);
      }
}

module.exports = new AuthRouter().router;
