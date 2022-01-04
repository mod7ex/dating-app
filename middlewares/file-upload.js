const multer = require("multer");
const { CustomAPIError } = require("../errors");
const path = require("path");
const { appPath } = require("../helpers");
let uploadPath = path.resolve(appPath, "uploads");

const upload = multer({
      limits: {
            files: 5,
            fileSize: 1024 * 1024, // in bytes
      },

      fileFilter: function (req, file, cb) {
            if (
                  file.mimetype !== "image/png" &&
                  file.mimetype !== "image/jpeg"
            ) {
                  return cb(new CustomAPIError("file type not allowed"));
            }

            cb(null, true);
      },

      storage: multer.diskStorage({
            destination: function (req, file, cb) {
                  // you should create the folder, multer won't do it
                  cb(null, uploadPath);
            },
            // destination: uploadPath,

            filename: function (req, file, cb) {
                  let filename = `${
                        // @ts-ignore
                        req.session.user._id
                  }-at-${Date.now()}_photo${path.extname(file.originalname)}`;

                  cb(null, filename);
            },
      }),
});

module.exports = upload;
