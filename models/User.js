require("dotenv").config();
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const { BadRequestError } = require("../errors");

const userSchema = new mongoose.Schema(
      {
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

            details: {
                  location: {
                        country: {
                              type: String,
                        },

                        state: {
                              type: String,
                        },

                        region: {
                              type: String,
                        },

                        city: {
                              type: String,
                        },

                        timezone: {
                              type: String,
                        },
                  },

                  marital_status: {
                        type: String,
                        enum: ["single", "divorced", "separated", "widowed"],
                  },

                  birth_day: Date,

                  height: Number,

                  weight: Number,

                  hair_color: {
                        type: Number,
                        min: 1,
                        max: 16,
                  },

                  eye_color: {
                        type: Number,
                        min: 1,
                        max: 16,
                  },

                  children: {
                        type: Number,
                        enum: [0, 1, 2, 3, 4],
                  },

                  relegion: {
                        type: Number,
                        min: 1,
                        max: 9,
                  },

                  smoking: {
                        type: Number,
                        min: 1,
                        max: 4,
                  },

                  drinking: {
                        type: Number,
                        min: 1,
                        max: 4,
                  },

                  education: {
                        type: String,
                        maxLength: 32,
                  },

                  ocupation: {
                        type: String,
                        maxLength: 32,
                  },

                  languages: {
                        type: Number,
                        min: 1,
                        max: 14,
                  },

                  partner_age: {
                        from: Number,
                        to: Number,
                  },
            },
      },
      { timestamps: true }
);

userSchema.post("validate", function () {
      if (this.password.length < 6 || this.password.length > 32)
            throw new BadRequestError(
                  "password length should be between 6 and 32"
            );
});

userSchema.pre("save", async function () {
      // hashing the password
      let salt = await bcryptjs.genSalt(10);
      this.password = await bcryptjs.hash(this.password, salt);
});

userSchema.methods.checkPassword = async function (passwd) {
      let isValid = await bcryptjs.compare(passwd, this.password);
      return isValid;
};

userSchema.virtual("public").get(function () {
      return {
            _id: this._id,
            first_name: this.first_name,
            last_name: this.last_name,
            username: this.username,
            email: this.email,
      };
});

module.exports = mongoose.model("User", userSchema);
