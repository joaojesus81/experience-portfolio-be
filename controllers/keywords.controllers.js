const {
  fetchKeywordGroups,
  fetchKeywords,
} = require("../models/keywords.models");

const sendKeywordGroups = (req, res, next) => {
  fetchKeywordGroups()
    .then((keywordGroups) => {
      res.status(200).send({ keywordGroups });
    })
    .catch((err) => {
      next(err);
    });
};

const sendKeywords = (req, res, next) => {
  const filters = req.query;
  fetchKeywords(filters)
    .then((keywords) => {
      console.log(keywords[0]);
      res.status(200).send({ keywords });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { sendKeywordGroups, sendKeywords };
