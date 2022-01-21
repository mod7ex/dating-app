const express = require("express");
const { UserController } = require("../controllers");
const Router = require("./router");

const { upload } = require("../middlewares");

class usersRouter extends Router {
      constructor() {
            super();

            this.router = express.Router();

            this.router.use(this.auth);

            let controller = new UserController();

            this.router.route("/search").get(controller.search);

            this.router.route("/find").get(controller.find);

            this.router
                  .route("/me/photos/main/:photo")
                  .patch(controller.set_main_photo);

            this.router
                  .route("/me/photos/delete/:photo")
                  .delete(controller.delete_photo);

            this.router
                  .route("/me/photos/delete")
                  .delete(controller.delete_all_photo);

            this.router
                  .route("/me/photos")
                  .get(controller.my_photos_edit)
                  .post(upload.array("photos", 5), controller.my_photos_update);

            this.router
                  .route("/me")
                  .get(controller.edit)
                  .patch(controller.update)
                  .delete(controller.destroy);

            this.router.get("/", controller.index);

            this.router.get("/:id", controller.show);
      }
}

module.exports = new usersRouter().router;
