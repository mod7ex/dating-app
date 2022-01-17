const {
      UnauthorizedError,
      BadRequestError,
      NotFoundError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");

const Controller = require("./controller");

class ChatController extends Controller {
      constructor() {
            super();
      }

      async index(req, res, next) {
            let user = await User.findById(req.params.id, {
                  password: 0,
                  createdAt: 0,
            });

            if (!user) throw new NotFoundError("User not found");

            console.log(user);

            super.render(req, res, next, "chat", {
                  user,
            });
      }
}

module.exports = ChatController;
