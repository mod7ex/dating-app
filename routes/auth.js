const express = require("express");

const { AuthController } = require("../controllers");

const Router = require("./router");

class AuthRouter extends Router {
      constructor() {
            super();

            this.router = express.Router();

            this.router
                  .route("/login")
                  .get(AuthController.getLogin)
                  .post(AuthController.login);

            this.router
                  .route("/register")
                  .get(AuthController.getRegister)
                  .post(AuthController.register);

            this.router.post("/logout", this.auth, AuthController.logout);
      }
}

module.exports = new AuthRouter().router;
