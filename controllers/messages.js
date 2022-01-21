const {
      UnauthorizedError,
      BadRequestError,
      NotFoundError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { Message, User } = require("../models");

const Controller = require("./controller");

class MessageController extends Controller {
      constructor() {
            super();
      }

      async createMessage(req, reciever, content) {
            let sender = req.session.user._id;
            if (reciever != req.session.talkingTo) return;
            let message = await Message.create({ sender, reciever, content });
            return message.sentAt;
      }
}

module.exports = MessageController;
