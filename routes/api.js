const express = require("express");

const { ApiController } = require("../controllers");

const Router = require("./router");

class ApiRouter extends Router {
      constructor() {
            super();

            this.router = express.Router();
            this.router.use(this.auth);
            let controller = new ApiController();

            // countries/states/ccities
            this.router.get(
                  "/locations/countries/:country_code/states/:state_code/cities",
                  controller.cities
            );

            this.router.get(
                  "/locations/countries/:country_code/states",
                  controller.states
            );

            this.router.get("/locations/countries", controller.countries);

            this.router.get("/locations", controller.location);
      }
}

module.exports = new ApiRouter().router;
