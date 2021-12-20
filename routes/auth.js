const express = require("express");

const { AuthController } = require("../controllers");

const auth = require("../middlewares/auth");

class AuthRouter {
      router = express.Router();

      constructor() {
            this.router
                  .route("/login")
                  .get(AuthController.getLogin)
                  .post(AuthController.login);

            this.router
                  .route("/register")
                  .get(AuthController.getRegister)
                  .post(AuthController.register);

            this.router.post("/logout", auth, AuthController.logout);
      }
}

module.exports = new AuthRouter().router;
