const express = require("express");
const { UserController } = require("../controllers");
const Router = require("./router");

class usersRouter extends Router {
      constructor() {
            super();

            this.router = express.Router();
            let controller = new UserController();

            this.router
                  .route("/me")
                  .get(this.auth, controller.edit)
                  .patch(this.auth, controller.update)
                  .delete(this.auth, controller.destroy);

            this.router.get("/", this.auth, controller.index);

            this.router.get("/:id", this.auth, controller.show);
      }
}

module.exports = new usersRouter().router;
