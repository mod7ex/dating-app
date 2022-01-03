const { writeLog } = require("../helpers");

const requestMiddleware = (req, res, next) => {
      let log = `[${Date.now()}] ---> ${req.method}: ${req.originalUrl} from ${
            req.ip
      }`;

      // console.log(log);

      // if (req.method == "POST") console.log(req.body);

      // writeLog(log, "request");

      next();
};

module.exports = requestMiddleware;
