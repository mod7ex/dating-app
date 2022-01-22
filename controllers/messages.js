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
            return message;
      }

      async messageRead(id) {
            let message = await Message.findByIdAndUpdate(id, { read: true });

            return message;
      }

      async fetchMessages(sender, reciever, page) {
            let limit = 10;
            let skip = (page - 1) * limit;

            let message = await Message.find({
                  $or: [{ sender }, { sender: reciever }],
            })
                  .sort("-sentAt")
                  .skip(skip)
                  .limit(limit);

            return message;
      }
}

module.exports = MessageController;
