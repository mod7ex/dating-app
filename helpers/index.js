const fs = require("fs").promises;
const path = require("path");

let appPath = path.dirname(__dirname);

let writeLog = async (data, logNature) => {
      let filePath = path.resolve(appPath, "logs", logNature + "s.log");

      let file_descriptor = await fs.open(filePath, "a");

      await fs.appendFile(filePath, data + " ;\n", "utf8");

      await file_descriptor.close();
};

module.exports = { writeLog, appPath };
