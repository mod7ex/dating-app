const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
      first_name: {
            type: String,
            required: [true, "First name is required"],
            maxLength: 16,
      },

      last_name: {
            type: String,
            required: [true, "Last name is required"],
            maxLength: 16,
      },

      username: {
            type: String,
            unique: true,
            required: [true, "Username is required"],
            maxLength: 16,
      },

      email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            match: [
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  "Please enter a valid email",
            ],
            maxLength: 320,
      },

      password: {
            type: String,
            required: [true, "Password is required"],
      },

      media: {
            main_image: String,
            images: [String],
      },

      isAdmin: {
            type: Boolean,
            default: false,
      },
});

module.exports = mongoose.model("User", userSchema);
