const fs = require("fs").promises;
const path = require("path");
const options = require("./data/data.json");
let appPath = path.dirname(__dirname);

let writeToFile = async (filePath, data, mode = "w") => {
      let fpath = path.resolve(appPath, filePath);

      let file_descriptor = await fs.open(fpath, mode);

      await fs.writeFile(fpath, data, "utf8");

      await file_descriptor.close();
};

let writeLog = async (data, logNature, mode = "a") => {
      let filePath = path.resolve(appPath, "logs", logNature + "s.log");

      let file_descriptor = await fs.open(filePath, mode);

      await fs.appendFile(filePath, data + " ;\n", "utf8");

      await file_descriptor.close();
};

let createUserObject = (payload) => {
      let {
            first_name,
            last_name,
            username,
            email,
            // password,
            country,
            state,
            city,
            timezone,
            marital_status,
            birth_day,
            height,
            weight,
            hair_color,
            eye_color,
            children,
            relegion,
            smoking,
            drinking,
            education,
            ocupation,
            languages,
            about_me,
            about_partner,
            partner_age_from,
            partner_age_to,
      } = payload;

      return {
            first_name,

            last_name,

            username,

            email,

            // password,

            details: {
                  location: {
                        country,

                        region: state,

                        city,

                        timezone,
                  },

                  marital_status,

                  birth_day,

                  height,

                  weight,

                  hair_color,

                  eye_color,

                  children,

                  relegion,

                  smoking,

                  drinking,

                  education,

                  ocupation,

                  languages,

                  partner_age: {
                        from: partner_age_from,
                        to: partner_age_to,
                  },

                  about_me,

                  about_partner,
            },
      };
};

module.exports = {
      writeLog,
      appPath,
      createUserObject,
      options,
      writeToFile,
};
