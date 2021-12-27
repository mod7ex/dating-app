const { StatusCodes } = require("http-status-codes");

class Controller {
      statusCodes = StatusCodes;

      constructor() {
            this.statusCodes = StatusCodes;
      }

      static persist_and_clean_before(req, res) {
            res.locals.data = {};
            res.locals.authenticated = req.session.authenticated;

            if (req.session.data) {
                  res.locals.data = req.session.data;
                  delete req.session.data;
            }

            if (req.session.error) {
                  res.locals.error = req.session.error;
                  this.statusCode = req.session.error.statusCode;
                  delete req.session.error;
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
            // Controller.persist_and_clean_before(req, res);
            res.status(status).redirect(where);
            // Controller.persist_and_clean_after(req);
      }
}

module.exports = Controller;
