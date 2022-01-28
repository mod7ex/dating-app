const { Message } = require("../models");
const Controller = require("./controller");

class MessageController extends Controller {
      constructor() {
            super();
      }

      async createMessage(sender, reciever, content) {
            let message = await Message.create({ sender, reciever, content });
            return message;
      }

      async messageRead(id) {
            let message = await Message.findByIdAndUpdate(id, { read: true });

            return message;
      }

      async fetchMessages(sender, reciever, page) {
            let limit = 13;
            let skip = (page - 1) * limit;

            let message = await Message.find({
                  $or: [{ sender }, { sender: reciever }],
            })
                  .sort("-sentAt")
                  .skip(skip)
                  .limit(limit);

            return message;
      }

      static async dropMessages(actor) {
            await Message.deleteMany({
                  $or: [{ reciever: actor }, { sender: actor }],
            });
      }
}

module.exports = MessageController;
