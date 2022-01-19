const { StatusCodes } = require("http-status-codes");
const { io } = require("../server");

class Controller {
      statusCodes = StatusCodes;

      constructor() {
            this.statusCodes = StatusCodes;
      }

      static persist_and_clean_before(req, res) {
            res.locals.data = {};
            res.locals.authenticated = req.session.authenticated;
            res.locals.csrf = req.csrfToken();

            if (req.session.data) {
                  res.locals.data = req.session.data;
                  delete req.session.data;
            }

            if (req.session.error) {
                  res.locals.error = req.session.error;
                  this.statusCode = req.session.error.statusCode;
                  delete req.session.error;
            }

            if (req.session.authenticated) {
                  res.locals.profile_photo = req.session.user.profile_photo;
            }
      }

      static persist_and_clean_after(req) {
            delete req.app.locals.error;
            req.app.locals.data = {};
      }

      render(req, res, next, template, payload, status = StatusCodes.OK) {
            if (req.session.error) {
                  status = req.session.error.statusCode;
            }

            Controller.persist_and_clean_before(req, res);

            res.status(status).render(template, payload);

            // Controller.persist_and_clean_after(req);
      }

      redirect(req, res, next, where, status = StatusCodes.OK) {
            if (req.session && req.session.error) {
                  status = req.session.error.statusCode;
            }

            // Controller.persist_and_clean_before(req, res);
            res.status(status).redirect(where);
            // Controller.persist_and_clean_after(req);
      }

      json(req, res, next, payload, status = StatusCodes.OK) {
            res.status(status).json(payload);
      }
}

module.exports = Controller;
