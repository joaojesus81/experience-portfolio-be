const staffRouter = require("express").Router();
const staffMetaRouter = require("./staffMeta.router");

// const { handle405s } = require("../errors");

staffRouter.use("/meta", staffMetaRouter);

module.exports = staffRouter;
