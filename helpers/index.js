const fsu = require("fs");
const fs = require("fs").promises;
const path = require("path");

let options = {};
let appPath = path.dirname(__dirname);

let dir = path.resolve(appPath, "helpers", "data");

if (!fsu.existsSync(dir)) fsu.mkdirSync(dir);

if (fsu.existsSync("./data/data.json")) options = require("./data/data.json");

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

let createUserObject = (payload) => {};

module.exports = {
      writeLog,
      appPath,
      createUserObject,
      options,
      writeToFile,
};
