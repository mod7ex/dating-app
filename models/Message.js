const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
      {
            sender: {
                  type: mongoose.SchemaTypes.ObjectId,
                  ref: "User",
            },

            reciever: {
                  type: mongoose.SchemaTypes.ObjectId,
                  ref: "User",
            },

            read: {
                  type: Boolean,
                  default: false,
            },

            content: String,
      },
      { timestamps: { createdAt: "sentAt" } }
);

module.exports = mongoose.model("Message", messageSchema);
