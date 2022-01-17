const express = require("express");
const { ChatController } = require("../controllers");
const Router = require("./router");

class chatRouter extends Router {
      constructor() {
            super();

            this.router = express.Router();
            let controller = new ChatController();

            this.router.route("/:id").get(this.auth, controller.index);
      }
}

module.exports = new chatRouter().router;
