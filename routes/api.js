const express = require("express");

const { ApiController } = require("../controllers");

const Router = require("./router");

class ApiRouter extends Router {
      constructor() {
            super();

            this.router = express.Router();
            let controller = new ApiController();

            // countries/states/ccities
            this.router.get(
                  "/locations/countries/:country_code/states/:state_code/cities",
                  this.auth,
                  controller.cities
            );

            this.router.get(
                  "/locations/countries/:country_code/states",
                  this.auth,
                  controller.states
            );

            this.router.get(
                  "/locations/countries",
                  this.auth,
                  controller.countries
            );
      }
}

module.exports = new ApiRouter().router;
