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

                        region: {
                              type: String,
                        },

                        city: {
                              type: String,
                        },

                        timezone: {
                              type: String,
                        },

                        stuff: [],
                  },

                  marital_status: {
                        type: Number,
                        min: 0,
                        max: 3,
                  },

                  birth_day: Date,

                  height: {
                        type: Number,
                        min: 1.34,
                        max: 2.42,
                  },

                  weight: {
                        type: Number,
                        min: 36,
                        max: 181,
                  },

                  hair_color: {
                        type: Number,
                        enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                  },

                  eye_color: {
                        type: Number,
                        enum: [0, 1, 2, 3, 4, 5],
                  },

                  children: {
                        type: Number,
                        enum: [0, 1, 2, 3, 4],
                  },

                  relegion: {
                        type: Number,
                        enum: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                  },

                  smoking: {
                        type: Number,
                        enum: [0, 1, 2, 3],
                  },

                  drinking: {
                        type: Number,
                        enum: [0, 1, 2, 3],
                  },

                  education: {
                        type: String,
                        maxLength: 32,
                  },

                  ocupation: {
                        type: String,
                        maxLength: 32,
                  },

                  languages: [
                        {
                              type: Number,
                              enum: [
                                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
                                    13,
                              ],
                        },
                  ],

                  partner_age: {
                        from: { type: Number, min: 18, max: 70 },
                        to: { type: Number, min: 18, max: 70 },
                  },

                  about_me: {
                        type: String,
                        maxlength: 124,
                  },

                  about_partner: {
                        type: String,
                        maxlength: 124,
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
