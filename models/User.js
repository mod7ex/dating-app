require("dotenv").config();
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const { BadRequestError } = require("../errors");

let countriesList = require("../helpers/data/countries.json");
let statesList = require("../helpers/data/states.json");
let citiesList = require("../helpers/data/cities.json");

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
                  get: (password) => {
                        return;
                  },
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
                  },

                  weight: {
                        type: Number,
                        min: 5,
                        max: 1000,
                  },

                  hair_color: {
                        type: Number,
                        enum: [...Array(13).keys()],
                  },

                  eye_color: {
                        type: Number,
                        enum: [...Array(6).keys()],
                  },

                  children: {
                        type: Number,
                        enum: [...Array(5).keys()],
                  },

                  relegion: {
                        type: Number,
                        enum: [...Array(9).keys()],
                  },

                  smoking: {
                        type: Number,
                        enum: [...Array(4).keys()],
                  },

                  drinking: {
                        type: Number,
                        enum: [...Array(4).keys()],
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
                              enum: [...Array(14).keys()],
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
      let length = this.toObject().password.length;
      if (length < 6 || length > 32)
            throw new BadRequestError(
                  "password length should be between 6 and 32"
            );
});

// @ts-ignore
userSchema.pre("save", async function () {
      // hashing the password
      let salt = await bcryptjs.genSalt(10);
      this.password = await bcryptjs.hash(this.toObject().password, salt);
});

userSchema.methods.checkPassword = async function (passwd) {
      // @ts-ignore
      let isValid = await bcryptjs.compare(passwd, this.toObject().password);
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

// userSchema.virtual("location").get(function () {
//       let country_code = this.details.location.country,
//             location = {};

//       if (!country_code) return location;

//       let country = countriesList.find((c) => c.code == country);

//       location.country = country.name;

//       let tz = this.details.location.timezone;
//       if (tz) {
//             let timezone = country.timezones[tz].tzName;
//             location.timezone = timezone;
//       }

//       let state_code = this.details.location.region;

//       if (!state_code) return location;

//       location.state = statesList.find(
//             (s) => s.code == state_code && s.country_code == country_code
//       ).name;

//       let city_index = this.details.location.city;

//       if (!city_index) return location;

//       // @ts-ignore
//       location.city = citiesList.find((ct) => ct.index == city_index).name;

//       return location;
// });

module.exports = mongoose.model("User", userSchema);
