const { CustomAPIError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { writeLog } = require("../helpers");
let { GenericController } = require("../controllers");

let controller = new GenericController();

const errorHandlerMiddleware = (err, req, res, next) => {
      let data = err.toString();
      let render = false;

      writeLog(data, "error");

      console.log({
            name: err.name,
            code: err.code,
            err,
      });

      let customError = {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Something went wrong try again later",
      };

      if (err instanceof CustomAPIError) {
            customError = {
                  statusCode: err.statusCode,
                  message: err.message,
            };

            render = err.render;
      }

      if (err instanceof CustomAPIError) {
            customError = {
                  statusCode: err.statusCode,
                  message: err.message,
            };

            render = err.render;
      }

      if (err.code == 11000) {
            customError.message = `Duplicate value for ${Object.keys(
                  err.keyValue
            )} field`;
            customError.statusCode = StatusCodes.BAD_REQUEST;
      }

      if (err.name == "ValidationError") {
            customError.message = Object.values(err.errors)
                  .map((item) => item.message)
                  .join(", ");

            customError.statusCode = StatusCodes.BAD_REQUEST;
      }

      if (err.name == "CastError") {
            customError.message = `No item found with id; ${err.value}`;

            customError.statusCode = StatusCodes.NOT_FOUND;
      }

      if (err.code == "EBADCSRFTOKEN") {
            // handle CSRF token errors here

            customError.message = "form tampered with";

            customError.statusCode = StatusCodes.FORBIDDEN;

            console.log("csrf; ", req._csrf);
      }

      if (err.code == "ENOENT") {
            customError.message = "file not found";

            customError.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
      }

      if (err.name == "TypeError") {
            customError.message = err.message;
            customError.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
            render = true;
      }

      // Rendering the error

      req.session.error = customError;

      if (err instanceof NotFoundError && err.render) {
            return controller.error(
                  req,
                  res,
                  next,
                  { error: err.message },
                  "404"
            );
      }

      if (render)
            return controller.error(req, res, next, { error: err.message });

      req.session.data = {
            ...req.body,
            ...req.query,
      };

      return res.redirect("back");
};

module.exports = errorHandlerMiddleware;
