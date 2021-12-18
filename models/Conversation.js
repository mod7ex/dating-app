const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
      {
            content: String,
      },
      { timestamps: true }
);

const conversationSchema = new mongoose.Schema(
      {
            side_a: {
                  type: mongoose.SchemaTypes.ObjectId,
                  ref: "User",
            },

            side_b: {
                  type: mongoose.SchemaTypes.ObjectId,
                  ref: "User",
            },

            messages: [messageSchema],
      },
      { timestamps: true }
);

module.exports = mongoose.model("User", conversationSchema);
