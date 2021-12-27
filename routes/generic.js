const express = require("express");
const { GenericController } = require("../controllers");
const Router = require("./router");

class GenericRouter extends Router {
      constructor() {
            super();

            this.router = express.Router();
            let controller = new GenericController();

            this.router.get("/", controller.home);

            this.router.get("/search", controller.search);
      }
}

module.exports = new GenericRouter().router;
