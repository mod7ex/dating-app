const express = require("express");
const { UserController } = require("../controllers");
const Router = require("./router");

class usersRouter extends Router {
      constructor() {
            super();

            this.router = express.Router();

            this.router
                  .route("/me")
                  .get(this.auth, UserController.edit)
                  .patch(this.auth, UserController.update)
                  .delete(this.auth, UserController.destroy);

            this.router.get("/", this.auth, UserController.index);

            this.router.get("/:id", this.auth, UserController.show);
      }
}

module.exports = new usersRouter().router;
