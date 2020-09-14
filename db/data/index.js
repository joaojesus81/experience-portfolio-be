const testData = require("./test");
const developmentData = require("./dev");
const productionData = require("./prod");

const ENV = process.env.NODE_ENV || "development";

if (ENV === "development") {
  exportData = developmentData;
} else if (ENV === "production") {
  exportData = productionData;
} else {
  exportData = testData;
}

module.exports = exportData;
