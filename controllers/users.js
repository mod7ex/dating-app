const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { UnauthorizedError } = require("../errors");

class UserController {
      async index(req, res, next) {
            let user = await User.findById(req.session.user._id);
      }
}

module.exports = UserController;
