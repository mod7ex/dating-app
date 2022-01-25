require("dotenv").config();
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const { BadRequestError } = require("../errors");

const {
      getDateFromMongoDate,
      timeSince,
      height_formula,
      weight_formula,
      getAgeFromDOB,
} = require("../helpers");

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
                  // select: false,
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
                                    if (!country_code) return;
                                    return countriesList.find(
                                          (c) => c.code == country_code
                                    ).name;
                              },
                        },

                        region: {
                              type: Number,
                              get: (region_index) => {
                                    if (!region_index) return;
                                    return statesList.find(
                                          (r) => r.index == region_index
                                    ).name;
                              },
                        },

                        city: {
                              type: Number,
                              get: (city_index) => {
                                    if (!city_index) return;
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
                              if (typeof status != "number") return;
                              return data.marital_status[status];
                        },
                  },

                  birth_day: {
                        type: Date,
                        get: getDateFromMongoDate,
                        validate: [
                              (v) => {
                                    if (!v) return false;

                                    if (getAgeFromDOB(v, false) < 18)
                                          return false;

                                    return true;
                              },
                              "you should be at least 18 years old",
                        ],
                  },

                  height: {
                        type: Number,
                        min: 55,
                        max: 280,
                        get: height_formula,
                  },

                  weight: {
                        type: Number,
                        min: 5,
                        max: 1000,
                        get: weight_formula,
                  },

                  hair_color: {
                        type: Number,
                        enum: [...Array(13).keys()],
                        get: (index) => {
                              if (typeof index != "number") return;
                              return data.hair_colors[index];
                        },
                  },

                  eye_color: {
                        type: Number,
                        enum: [...Array(6).keys()],
                        get: (index) => {
                              if (typeof index != "number") return;
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
                              if (typeof index != "number") return;
                              return data.relegions[index];
                        },
                  },

                  smoking: {
                        type: Number,
                        enum: [...Array(4).keys()],
                        get: (index) => {
                              if (typeof index != "number") return;
                              return data.habit[index];
                        },
                  },

                  drinking: {
                        type: Number,
                        enum: [...Array(4).keys()],
                        get: (index) => {
                              if (typeof index != "number") return;
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
                              if (!arr.length) return [];
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

            createdAt: {
                  type: Date,
                  get: (date) => timeSince(date),
            },

            updatedAt: {
                  type: Date,
                  get: (date) => timeSince(date),
            },
      },
      {
            timestamps: true,
            toJSON: { getters: true, virtuals: true },
            toObject: { getters: false, virtuals: true },
      }
);

let hashPassword = async function (password) {
      if (!password) return;

      // hashing the password
      let salt = await bcryptjs.genSalt(10);
      let passwordHash = await bcryptjs.hash(password, salt);

      return passwordHash;
};

let isValidPassword = function (password) {
      if (!password) return false;
      let length = password.length;
      return length > 5 && length < 33;
};

userSchema.methods = {
      checkPassword: async function (passwd) {
            // @ts-ignore
            let isValid = await bcryptjs.compare(passwd, this.password);
            return isValid;
      },
      isValidPassword,
      hashPassword,
};

userSchema.post("validate", function (doc, next) {
      if (!this.isValidPassword(this.password))
            return next(new BadRequestError("Invalid password!"));

      return next();
});

// @ts-ignore
userSchema.pre("save", async function (next) {
      if (!this.password) return next();
      this.password = await this.hashPassword(this.password);
      next();
});

userSchema.pre("findOneAndUpdate", function (next) {
      // @ts-ignore
      this.options.runValidators = true;
      // @ts-ignore
      this.options.new = true;
      next();
});

// @ts-ignore
userSchema.pre("findOneAndUpdate", function (next) {
      // @ts-ignore
      let password = this.getUpdate().password;
      if (!password) return next();

      if (!isValidPassword(password))
            return next(new BadRequestError("Invalid password!"));

      /* Hash the password */
      // @ts-ignore
      this._update.password = hashPassword(password);

      next();
});

//   ************************************************ Virtuals

userSchema.virtual("full_name").get(function () {
      return `${this.first_name} ${this.last_name}`;
});

userSchema.virtual("age").get(function () {
      let dob = this.details.birth_day;
      return getAgeFromDOB(dob);
});

userSchema.virtual("mediaCount").get(function () {
      return this.media.length;
});

userSchema.virtual("public").get(function () {
      return {
            _id: this._id.toString(),
            first_name: this.first_name,
            last_name: this.last_name,
            username: this.username,
            email: this.email,
            profile_photo: this.media.length ? this.media[0] : null,
            mediaCount: this.mediaCount,
      };
});

module.exports = mongoose.model("User", userSchema);
