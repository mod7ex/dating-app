const fsu = require("fs");
const path = require("path");
const { writeToFile, appPath } = require("./helpers");

const countries = require("./json/countries.json");
const states = require("./json/states.json");
const cities = require("./json/cities.json");

let countriesList = [];
let statesList = [];
let citiesList = [];

let generate = (i) => {
      switch (i) {
            case 1:
                  countries.forEach((c) => {
                        let name = c.name,
                              timezones = c.timezones,
                              code = c.iso2;

                        countriesList.push({
                              name,
                              code,
                              timezones,
                        });
                  });
                  break;

            case 2:
                  states.forEach((s, i) => {
                        let name = s.name,
                              code = s.state_code,
                              country_code = s.country_code;

                        statesList.push({
                              index: i,
                              name,
                              code,
                              country_code,
                        });
                  });
                  break;

            case 3:
                  cities.forEach((ct, i) => {
                        let name = ct.name,
                              state_code = ct.state_code,
                              country_code = ct.country_code;

                        citiesList.push({
                              index: i,
                              name,
                              state_code,
                              country_code,
                        });
                  });
                  break;

            default:
                  break;
      }
};

// ****************************************
/*

let min_weight = 5; // weight in pounds
let max_weight = 1000; // weight in pounds

let weights = [];
for (let i = min_weight; i <= max_weight; i++) {
      weights.push(`${i} lb  (${Number(i * 0.453592).toFixed(2)} kg)`);
}

// ****************

let min_height = 55; // height in cm
let max_height = 280; // height in cm

let heights = [];
for (let i = min_height; i <= max_height; i++) {
      heights.push(`${i} cm  (${i / 100} m)`);
}

*/
// ****************************************

/**
 *
 * this data shouldn't change order
 *
 */

let data = {
      // weights,
      min_weight: 5, // weight in pounds
      max_weight: 1000, // weight in pounds

      // heights,
      min_height: 55, // height in cm
      max_height: 280, // height in cm

      children_max: 5,
      min_age: 18,
      max_age: 70,

      hair_colors: [
            "Auburn",
            "Bald",
            "Black",
            "Blonde",
            "Brown",
            "Brunette",
            "Charcoal",
            "Chestnut",
            "Golden",
            "Gray",
            "Red",
            "Silver",
            "White",
      ],

      eye_color: ["Black", "Brown", "Blue", "Gray", "Green", "Hazel"],

      relegions: [
            "Non-believer",
            "Muslim",
            "Agnostic",
            "Another",
            "Baptist",
            "Buddhist",
            "Catholic",
            "Christian",
            "Jewish",
      ],

      habit: ["No", "Rarely", "Often", "Very often"],

      languages: [
            "Arabic",
            "English",
            "Japanese",
            "German",
            "Turkish",
            "French",
            "Russian",
            "Italian",
            "Greek",
            "Spanish",
            "Dutch",
            "Portuguese",
            "Polish",
            "Chinese",
            "Romanian",
      ],

      marital_status: ["single", "divorced", "separated", "widowed"],
};

let filePath = (name) => {
      return `./helpers/data/${name}.json`;
};

let dataDir = path.resolve(appPath, "helpers", "data");
let uploadPath = path.resolve(appPath, "uploads");
if (!fsu.existsSync(dataDir)) fsu.mkdirSync(dataDir);
if (!fsu.existsSync(uploadPath)) fsu.mkdirSync(uploadPath);

if (typeof process.argv[2] != "undefined") {
      switch (process.argv[2]) {
            case "data":
                  writeToFile(filePath("data"), JSON.stringify(data));
                  break;

            case "countries":
                  generate(1);
                  writeToFile(
                        filePath("countries"),
                        JSON.stringify(countriesList)
                  );
                  break;

            case "states":
                  generate(2);
                  writeToFile(filePath("states"), JSON.stringify(statesList));
                  break;

            case "cities":
                  generate(3);
                  writeToFile(filePath("cities"), JSON.stringify(citiesList));
                  break;

            default:
                  break;
      }
} else {
      generate(1);
      generate(2);
      generate(3);

      writeToFile(filePath("data"), JSON.stringify(data));
      writeToFile(filePath("countries"), JSON.stringify(countriesList));
      writeToFile(filePath("states"), JSON.stringify(statesList));
      writeToFile(filePath("cities"), JSON.stringify(citiesList));
}
