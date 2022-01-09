const express = require("express");
const { UserController } = require("../controllers");
const Router = require("./router");

const { upload } = require("../middlewares");

class usersRouter extends Router {
      constructor() {
            super();

            this.router = express.Router();
            let controller = new UserController();

            this.router
                  .route("/search")
                  .get(this.auth, controller.search)
                  .post(this.auth, controller.find);

            this.router
                  .route("/me/photos/main/:photo")
                  .patch(this.auth, controller.set_main_photo);

            this.router
                  .route("/me/photos/delete/:photo")
                  .delete(this.auth, controller.delete_photo);

            this.router
                  .route("/me/photos")
                  .get(this.auth, controller.my_photos_edit)
                  .post(
                        this.auth,
                        upload.array("photos", 5),
                        controller.my_photos_update
                  );

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
