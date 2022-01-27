const {
      UnauthorizedError,
      BadRequestError,
      NotFoundError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const { redisClient } = require("../db");

const Controller = require("./controller");

class ChatController extends Controller {
      constructor() {
            super();
      }

      async index(req, res, next) {
            let id = req.params.id;

            let user = await User.findById(req.params.id, {
                  password: 0,
                  createdAt: 0,
            });

            if (!user) throw new NotFoundError("User not found");

            req.session.talkingTo = id;

            let online = await user.is_online();

            super.render(req, res, next, "chat", {
                  user,
                  online,
            });
      }
}

module.exports = ChatController;
