const testData = require("./test");
const developmentData = require("./dev");
const productionData = require("./prod");

const ENV = process.env.NODE_ENV || "development";

//Note !!! Production set to dev data for now due to size during development!!

if (ENV === "development") {
  exportData = developmentData;
} else if (ENV === "production") {
  exportData = developmentData;
} else {
  exportData = testData;
}

module.exports = exportData;
