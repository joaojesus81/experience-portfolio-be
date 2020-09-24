const { getAPIJSON, getDBInfo } = require("../models/apis.models");

const sendAPIs = (req, res, next) => {
  getAPIJSON((err, apiObj) => {
    if (err) next(err);
    const parsedObj = JSON.parse(apiObj);
    res.status(200).send(parsedObj);
  });
};

const sendDBInfo = (req, res, next) => {
  getDBInfo()
    .then((dbInfo) => {
      console.log(dbInfo);
      res.status(200).send({ dbInfo });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { sendAPIs, sendDBInfo };
