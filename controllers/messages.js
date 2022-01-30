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

      async fetchMessages(me, him, page) {
            let limit = 13;
            let skip = (page - 1) * limit;

            let messages = await Message.find({
                  $or: [
                        { $and: [{ sender: me }, { reciever: him }] },
                        { $and: [{ reciever: me }, { sender: him }] },
                  ],
            })
                  .sort("-sentAt")
                  .skip(skip)
                  .limit(limit);

            console.log(messages);

            return messages;
      }

      static async dropMessages(actor) {
            await Message.deleteMany({
                  $or: [{ reciever: actor }, { sender: actor }],
            });
      }

      getUnreadedMessagesCount(me, cb) {
            Message.count({ reciever: me, read: false }, (err, count) => {
                  cb(count);
            });
      }
}

module.exports = MessageController;
