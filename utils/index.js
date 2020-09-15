const moment = require("moment");

const formatAxiosDates = (date) => {
  const dateStr = moment(date).format("YYYY-MM-DD HH:mm:ss");
  return dateStr;
};

module.exports = { formatAxiosDates };
