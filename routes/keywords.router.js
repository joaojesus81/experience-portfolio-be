const keywordsRouter = require("express").Router();

const { handle405s } = require("../errors");

const {
  sendKeywordGroups,
  sendKeywords,
  sendKeywordGroupsByStaffID,
} = require("../controllers/keywords.controllers");

keywordsRouter.route("/groups").get(sendKeywordGroups).all(handle405s);

keywordsRouter
  .route("/groups/:StaffID")
  .get(sendKeywordGroupsByStaffID)
  .all(handle405s);

keywordsRouter.route("/").get(sendKeywords).all(handle405s);

module.exports = keywordsRouter;
