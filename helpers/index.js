const fs = require("fs").promises;
const fsu = require("fs");
const path = require("path");
const options = require("./data/data.json");
let appPath = path.dirname(__dirname);

let dic = {
      h: 60 * 60,
      d: 60 * 60 * 24,
      w: 60 * 60 * 24 * 7,
      m: 60 * 60 * 24 * 30,
      y: 60 * 60 * 24 * 30 * 12,
};

let cleanObj = (obj) => {
      for (let key of Object.keys(obj)) {
            if (!obj[key]) delete obj[key];
      }

      return obj;
};

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
let toNumArr = (arr) => {
      if (!arr) return [];
      return arr.map((str) => toNum(str));
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

let height_formula = (i) => {
      if (!i) return;
      return `${i} cm  (${i / 100} m)`;
};
let weight_formula = (i) => {
      if (!i) return;
      return `${i} lb  (${Number(i * 0.453592).toFixed(2)} kg)`;
};

let getDateFromMongoDate = (date) => {
      if (!date) return;
      date = new Date(date);
      return date.toISOString().split("T")[0];
};

let getAgeFromDOB = function (dob, convert = true) {
      // let dob = this.details.birth_day;
      if (!dob) return;
      let today = new Date();
      let birthDate = convert ? new Date(dob) : dob;
      let age = today.getFullYear() - birthDate.getFullYear();
      let m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
      }
      return age;
};

let createUserObject = (payload) => {
      let {
            first_name,
            last_name,
            username,
            email,
            password,
            password_confirmation,
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

      let obj = cleanObj({
            first_name,

            last_name,

            username,

            email,

            details: cleanObj({
                  location: cleanObj({
                        country,
                        region: state,
                        city,
                        timezone,
                  }),
                  marital_status,
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
                  languages: toNumArr(languages),
                  partner_age: cleanObj({
                        from: partner_age_from,
                        to: partner_age_to,
                  }),
                  about_me,
                  about_partner,
            }),
      });

      if (password_confirmation || password) {
            obj.password = password;
            obj.password_confirmation = password_confirmation;
      }

      if (birth_day) obj.details.birth_day = birth_day;

      console.log(obj);

      return obj;
};

let fromStrToNumTime = (str) => {
      let l = str.length;
      let unt = str.substring(l - 1, l),
            num = Number(str.substring(0, l - 1));

      return 1000 * num * dic[unt];
};

module.exports = {
      getDateFromMongoDate,
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
      getAgeFromDOB,
      cleanObj,
      fromStrToNumTime,
};
