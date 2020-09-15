const { getAPIJSON } = require("../models/apis.models");

const sendAPIs = (req, res, next) => {
  getAPIJSON((err, apiObj) => {
    if (err) next(err);
    const parsedObj = JSON.parse(apiObj);
    res.status(200).send(parsedObj);
  });
};

module.exports = sendAPIs;
