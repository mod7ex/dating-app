const express = require("express");
const { ChatController } = require("../controllers");
const Router = require("./router");

class chatRouter extends Router {
      constructor() {
            super();
            this.router = express.Router();
            this.router.use(this.auth);
            let controller = new ChatController();
            this.router.route("/:id").get(controller.index);
      }
}

module.exports = new chatRouter().router;
