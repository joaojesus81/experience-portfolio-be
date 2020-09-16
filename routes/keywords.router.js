const keywordsRouter = require("express").Router();

const { handle405s } = require("../errors");

const {
  sendKeywordGroups,
  sendKeywords,
} = require("../controllers/keywords.controllers");

keywordsRouter.route("/groups").get(sendKeywordGroups).all(handle405s);

keywordsRouter.route("/").get(sendKeywords).all(handle405s);

module.exports = keywordsRouter;
