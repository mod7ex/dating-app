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
                  .get(this.guest, controller.getLogin)
                  .post(this.guest, controller.login);

            this.router
                  .route("/register")
                  .get(this.guest, controller.getRegister)
                  .post(this.guest, controller.register);

            this.router.post("/logout", this.auth, controller.logout);
      }
}

module.exports = new AuthRouter().router;
