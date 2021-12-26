const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
      let customError = {
            statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
            message: err.message || "Something went wrong try again later",
      };

      // if (err instanceof CustomAPIError) {
      //       return res
      //             .status(err.statusCode)
      //             .render("error", { error: err.message });
      // }

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

      // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', {error: err});
      // return res
      //       .status(customError.statusCode)
      //       .render("error", { message: customError.message });

      console.log(err);
      // req.app.locals.error = customError;
      // res.locals.error = customError;
      req.session.error = customError;

      return res.redirect("back");
};

module.exports = errorHandlerMiddleware;
