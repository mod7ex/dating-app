const User = require("../models/User");
const { UnauthorizedError, NotFoundError } = require("../errors");
const Controller = require("./controller");
const {
      options,
      createUserObject,
      unlinkImg,
      toNum,
      toNumArr,
} = require("../helpers");

class UserController extends Controller {
      constructor() {
            super();
      }

      async index(req, res, next) {
            let users = await User.find({});

            super.render(req, res, next, "user/listing", { users });
      }

      async show(req, res, next) {
            let user = await User.findById(req.params.id);

            if (!user) throw new NotFoundError("User not found");

            super.render(req, res, next, "user/profile", { user });
      }

      async edit(req, res, next) {
            let user = await User.findById(req.session.user._id);

            if (!user) throw new UnauthorizedError("Unauthorized");

            let mode = "";

            if (req.query.edit == "true") {
                  if (req.session.error && req.session.data) {
                        // if an error occured we should persist the data
                        user = createUserObject(req.session.data);
                        delete req.session.data;
                        delete req.session.error;
                  }
                  mode = "-edit";
            }

            return super.render(req, res, next, "user/my-profile" + mode, {
                  user,
                  ...options,
            });
      }

      async update(req, res, next) {
            let update_payload = createUserObject(req.body);

            let user = await User.findByIdAndUpdate(
                  req.session.user._id,
                  update_payload,
                  {
                        new: true,
                  }
            );

            if (!user) throw new UnauthorizedError("Unauthorized");

            super.redirect(req, res, next, "back");
      }

      async destroy(req, res, next) {
            let user = await User.findByIdAndDelete(req.session.user._id);

            if (!user) throw new UnauthorizedError("Unauthorized");

            req.session.destroy();

            super.redirect(req, res, next, "/");
      }

      async my_photos_edit(req, res, next) {
            let user = await User.findById(req.session.user._id);

            if (!user) throw new UnauthorizedError("Unauthorized");

            super.render(req, res, next, "user/my-photos", {
                  photos: user.media,
            });
      }

      async my_photos_update(req, res, next) {
            let media = req.files.map((file) => file.filename);

            let user = await User.findByIdAndUpdate(
                  req.session.user._id,
                  { $push: { media: { $each: media } } },
                  {
                        new: true,
                  }
            );

            if (!user) throw new UnauthorizedError("Unauthorized");

            super.redirect(req, res, next, "back");
      }

      async delete_photo(req, res, next) {
            let { photo } = req.params;

            if (
                  !photo.includes("-at-") ||
                  photo.split("-at-")[0] != req.session.user._id.toString()
            )
                  new UnauthorizedError("Unauthorized");

            let user = await User.findByIdAndUpdate(
                  req.session.user._id,
                  { $pull: { media: photo } },
                  {
                        new: true,
                  }
            );

            if (!user) throw new UnauthorizedError("Unauthorized");

            await unlinkImg(photo);

            super.redirect(req, res, next, "back");
      }

      async set_main_photo(req, res, next) {
            let { photo } = req.params;

            if (
                  !photo.includes("-at-") ||
                  photo.split("-at-")[0] != req.session.user._id.toString()
            )
                  new UnauthorizedError("Unauthorized");

            await User.bulkWrite([
                  {
                        updateOne: {
                              filter: { _id: req.session.user._id },
                              update: {
                                    $pull: { media: photo },
                              },
                        },
                  },
                  {
                        updateOne: {
                              filter: { _id: req.session.user._id },
                              update: {
                                    $push: {
                                          media: {
                                                $each: [photo],
                                                $position: 0,
                                          },
                                    },
                              },
                        },
                  },
            ]);

            super.redirect(req, res, next, "back");
      }

      search(req, res, next) {
            super.render(req, res, next, "search", options);
      }

      async find(req, res, next) {
            let {
                  name,
                  partner_age_from,
                  partner_age_to,
                  country,
                  state,
                  city,
                  height_from,
                  height_to,
                  weight_from,
                  weight_to,
                  hair_colors,
                  eye_colors,
                  relegions,
                  marital_status,
                  smoking,
                  drinking,
                  online,
                  with_photos,
                  languages,
            } = req.body;

            let queryObj = {};

            // queryObj._id = { $not: req.session.user._id };

            if (name) {
                  queryObj.$or = [
                        { first_name: { $regex: name, $options: "i" } },
                        { last_name: { $regex: name, $options: "i" } },
                  ];
            }

            if (with_photos) {
                  queryObj.media = { $not: { $size: 0 } };
            }

            if (country) {
                  queryObj["details.location.country"] = country;

                  if (state) {
                        queryObj["details.location.region"] = state;

                        if (city)
                              queryObj["details.location.city"] = toNum(city);
                  }
            }

            if (height_from || height_to) {
                  let q_height = {};

                  if (height_from) {
                        q_height.$gte = toNum(height_from);
                  }

                  if (height_to) {
                        q_height.$lte = toNum(height_to);
                  }

                  queryObj["details.height"] = q_height;
            }

            if (weight_from || weight_to) {
                  let q_weight = {};

                  if (weight_from) {
                        q_weight.$gte = toNum(weight_from);
                  }

                  if (weight_to) {
                        q_weight.$lte = toNum(weight_to);
                  }

                  queryObj["details.weight"] = q_weight;
            }

            if (hair_colors) {
                  queryObj["details.hair_color"] = {
                        $in: toNumArr(hair_colors),
                  };
            }

            if (eye_colors) {
                  queryObj["details.eye_color"] = { $in: toNumArr(eye_colors) };
            }

            if (relegions) {
                  queryObj["details.relegion"] = { $in: toNumArr(relegions) };
            }

            if (marital_status) {
                  queryObj["details.marital_status"] = {
                        $in: toNumArr(marital_status),
                  };
            }

            if (smoking) {
                  queryObj["details.smoking"] = { $in: toNumArr(smoking) };
            }

            if (drinking) {
                  queryObj["details.drinking"] = { $in: toNumArr(drinking) };
            }

            if (languages) {
                  queryObj["details.languages"] = { $in: toNumArr(languages) };
            }

            let projectFields = { first_name: 1, last_name: 1 };

            let pipeline = [
                  { $match: queryObj },
                  {
                        $project: {
                              ...projectFields,

                              profile_photo: { $arrayElemAt: ["$media", 0] },

                              diffyear: {
                                    $subtract: [
                                          { $year: "$$NOW" },
                                          { $year: "$details.birth_day" },
                                    ],
                              },

                              diffmonth: {
                                    $subtract: [
                                          { $month: "$$NOW" },
                                          {
                                                $month: "$details.birth_day",
                                          },
                                    ],
                              },

                              diffday: {
                                    $subtract: [
                                          { $dayOfMonth: "$$NOW" },
                                          {
                                                $dayOfMonth:
                                                      "$details.birth_day",
                                          },
                                    ],
                              },

                              stepValue: {
                                    $cond: [
                                          {
                                                $or: [
                                                      {
                                                            $lt: [
                                                                  "$diffmonth",
                                                                  0,
                                                            ],
                                                      },
                                                      {
                                                            $and: [
                                                                  {
                                                                        $eq: [
                                                                              "$diffmonth",
                                                                              0,
                                                                        ],
                                                                  },
                                                                  {
                                                                        $lt: [
                                                                              "$diffday",
                                                                              0,
                                                                        ],
                                                                  },
                                                            ],
                                                      },
                                                ],
                                          },
                                          -1,
                                          0,
                                    ],
                              },
                        },
                  },
                  {
                        $project: {
                              ...projectFields,

                              profile_photo: 1,

                              age: {
                                    $add: ["$diffyear", "$stepValue"],
                              },
                        },
                  },
            ];

            if (partner_age_from || partner_age_to) {
                  let match = { age: {} };

                  if (partner_age_from) {
                        match.age.$gte = toNum(partner_age_from);
                  }

                  if (partner_age_to) {
                        match.age.$lte = toNum(partner_age_to);
                  }

                  pipeline.push({
                        // @ts-ignore
                        $match: match,
                  });
            }

            let users = await User.aggregate(pipeline);

            if (!users.length)
                  throw new NotFoundError("No user matches your search!");

            super.render(req, res, next, "user/listing", { users });
      }
}

module.exports = UserController;
