const infoRouter = require("express").Router();
const { sendDBInfo } = require("../controllers/apis.controllers");

const { handle405s } = require("../errors");

infoRouter.route("/").get(sendDBInfo).all(handle405s);

module.exports = infoRouter;
