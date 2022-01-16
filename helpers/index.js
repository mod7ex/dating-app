const fs = require("fs").promises;
const fsu = require("fs");
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

let unlinkImg = async (name) => {
      await fs.unlink(path.resolve(appPath, "uploads", name));
};

let toNum = (str) => new Number(str).valueOf();
let toNumArr = (arr) => arr.map((str) => toNum(str));

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

let timeSince = (date) => {
      let seconds = Math.floor((Date.now() - date) / 1000);

      let interval = seconds / 31536000; // years

      let n;

      if (interval > 1) {
            n = Math.floor(interval);
            return `${n} year${n - 1 ? "s" : ""}`;
      }

      interval = seconds / 2592000; // months
      if (interval > 1) {
            n = Math.floor(interval);
            return `${n} month${n - 1 ? "s" : ""}`;
      }

      interval = seconds / 86400; // days
      if (interval > 1) {
            n = Math.floor(interval);
            return `${n} day${n - 1 ? "s" : ""}`;
      }

      interval = seconds / 3600; // hours
      if (interval > 1) {
            n = Math.floor(interval);
            return `${n} hour${n - 1 ? "s" : ""}`;
      }

      interval = seconds / 60; // minutes
      if (interval > 1) {
            n = Math.floor(interval);
            return `${n} minute${n - 1 ? "s" : ""}`;
      }

      n = Math.floor(seconds);
      return `${n} second${n - 1 ? "s" : ""}`;
};

let height_formula = (i) => `${i} cm  (${i / 100} m)`;
let weight_formula = (i) => `${i} lb  (${Number(i * 0.453592).toFixed(2)} kg)`;

module.exports = {
      height_formula,
      weight_formula,
      writeLog,
      unlinkImg,
      appPath,
      createUserObject,
      options,
      writeToFile,
      toNum,
      toNumArr,
      timeSince,
};
