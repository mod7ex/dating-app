const { StatusCodes } = require("http-status-codes");

class Controller {
      statusCodes = null;

      constructor() {
            this.statusCodes = StatusCodes;
      }

      render(req, res, next, template, payload, status = StatusCodes.OK) {
            if (req.session && req.session.data) {
                  res.locals.data = req.session.data;
                  delete req.session.data;
            }
            if (req.session && req.session.error) {
                  res.locals.error = req.session.error;
                  delete req.session.error;
            }
            res.status(status).render(template, payload);
            // delete req.app.locals.error;
            // req.app.locals.data = {};
      }

      redirect(req, res, next, where, status = StatusCodes.OK) {
            if (req.session) {
                  if (req.session.data) {
                        res.locals.data = req.session.data;
                        delete req.session.data;
                  }

                  if (req.session.error) {
                        res.locals.error = req.session.error;
                        delete req.session.error;
                  }
            }

            res.status(status).redirect(where);

            // delete req.app.locals.error;
            // req.app.locals.data = {};
      }
}

module.exports = Controller;
