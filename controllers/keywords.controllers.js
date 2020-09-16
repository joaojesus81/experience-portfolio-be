const {
  fetchKeywordGroups,
  fetchKeywords,
  fetchKeywordsByProjectCode,
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
      res.status(200).send({ keywords });
    })
    .catch((err) => {
      next(err);
    });
};

const sendKeywordsByProjectCode = (req, res, next) => {
  const { ProjectCode } = req.params;
  const filters = req.query;

  fetchKeywordsByProjectCode(ProjectCode, filters)
    .then((keywords) => {
      res.status(200).send({ keywords });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { sendKeywordGroups, sendKeywords, sendKeywordsByProjectCode };
