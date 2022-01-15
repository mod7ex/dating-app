require("dotenv").config();
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const { BadRequestError } = require("../errors");

const { timeSince, height_formula, weight_formula } = require("../helpers");

let countriesList = require("../helpers/data/countries.json");
let statesList = require("../helpers/data/states.json");
let citiesList = require("../helpers/data/cities.json");
let data = require("../helpers/data/data.json");

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
                  type: [String],
                  validate: [
                        (val) => val.length < 6,
                        "only 5 photos can be uploaded",
                  ],
            },

            isAdmin: {
                  type: Boolean,
                  default: false,
            },

            details: {
                  location: {
                        country: {
                              type: String,
                              get: (country_code) => {
                                    return countriesList.find(
                                          (c) => c.code == country_code
                                    ).name;
                              },
                        },

                        region: {
                              type: String,
                              // get: (region_code) => {
                              //       return statesList.find(
                              //             (s) =>
                              //                   s.code == region_code &&
                              //                   s.country_code == country_code
                              //       ).name;
                              // },
                        },

                        city: {
                              type: Number,
                              get: (city_index) => {
                                    // @ts-ignore
                                    return citiesList.find(
                                          (ct) => ct.index == city_index
                                    ).name;
                              },
                        },

                        timezone: {
                              type: String,
                        },

                        stuff: [],
                  },

                  marital_status: {
                        type: Number,
                        enum: [...Array(4).keys()],
                        get: (status) => {
                              return data.marital_status[status];
                        },
                  },

                  birth_day: {
                        type: Date,
                        get: (date) => {
                              if (date) return date.toISOString().split("T")[0];
                        },
                  },

                  height: {
                        type: Number,
                        min: 55,
                        max: 280,
                        get: (i) => height_formula(i),
                  },

                  weight: {
                        type: Number,
                        min: 5,
                        max: 1000,
                        get: (i) => weight_formula(i),
                  },

                  hair_color: {
                        type: Number,
                        enum: [...Array(13).keys()],
                        get: (index) => {
                              return data.hair_colors[index];
                        },
                  },

                  eye_color: {
                        type: Number,
                        enum: [...Array(6).keys()],
                        get: (index) => {
                              return data.eye_color[index];
                        },
                  },

                  children: {
                        type: Number,
                        enum: [...Array(5).keys()],
                  },

                  relegion: {
                        type: Number,
                        enum: [...Array(9).keys()],
                        get: (index) => {
                              return data.relegions[index];
                        },
                  },

                  smoking: {
                        type: Number,
                        enum: [...Array(4).keys()],
                        get: (index) => {
                              return data.habit[index];
                        },
                  },

                  drinking: {
                        type: Number,
                        enum: [...Array(4).keys()],
                        get: (index) => {
                              return data.habit[index];
                        },
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
                        type: [
                              {
                                    type: Number,
                                    enum: [...Array(14).keys()],
                              },
                        ],
                        get: (arr) => {
                              return data.languages.filter((item, index) =>
                                    arr.includes(index)
                              );
                        },
                  },

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
      {
            timestamps: true,
      }
);

userSchema.post("validate", function () {
      let length = this.password.length;
      if (length < 6 || length > 32)
            throw new BadRequestError(
                  "password length should be between 6 and 32"
            );
});

// @ts-ignore
userSchema.pre("save", async function () {
      // hashing the password
      let salt = await bcryptjs.genSalt(10);
      this.password = await bcryptjs.hash(this.password, salt);
});

userSchema.methods.checkPassword = async function (passwd) {
      // @ts-ignore
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
            profile_photo: this.media.length ? this.media[0] : null,
      };
});

userSchema.virtual("full_name").get(function () {
      return `${this.first_name} ${this.last_name}`;
});

userSchema.virtual("age").get(function () {
      let today = new Date();
      let birthDate = new Date(this.details.birth_day);
      let age = today.getFullYear() - birthDate.getFullYear();
      let m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
      }
      return age;
});

module.exports = mongoose.model("User", userSchema);
