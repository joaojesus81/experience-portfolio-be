const staffRouter = require("express").Router();
const staffMetaRouter = require("./staffMeta.router");

const { handle405s } = require("../errors");
const { sendCredentials } = require("../controllers/staff.controllers");

staffRouter.use("/meta", staffMetaRouter);

staffRouter.route("/login").post(sendCredentials).all(handle405s);

module.exports = staffRouter;
