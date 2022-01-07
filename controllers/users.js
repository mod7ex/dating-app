const User = require("../models/User");
const { UnauthorizedError, NotFoundError } = require("../errors");
const Controller = require("./controller");
const { options, createUserObject, unlinkImg } = require("../helpers");

class UserController extends Controller {
      constructor() {
            super();
      }

      async index(req, res, next) {
            let users = await User.find({});

            super.render(req, res, next, "user/listing", { users });
      }

      search(req, res, next) {
            super.render(req, res, next, "search", options);
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
}

module.exports = UserController;
