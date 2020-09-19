const apiRouter = require("express").Router();
const staffRouter = require("./staff.router");
const projectsRouter = require("./projects.router");
const projectRouter = require("./project.router");
const keywordsRouter = require("./keywords.router");
const sendAPIs = require("../controllers/apis.controllers");
const { generateCV } = require("../docx/docxApp");
const { generateFromUrl } = require("../docx/arupCVStyle");

const { handle405s } = require("../errors");

apiRouter.use("/staff", staffRouter);
apiRouter.use("/projects", projectsRouter);
apiRouter.use("/project", projectRouter);
apiRouter.use("/keywords", keywordsRouter);

apiRouter.route("/").get(sendAPIs).all(handle405s);

apiRouter
  .route("/cv/:StaffID")
  .get(generateCV)
  .patch(generateFromUrl)
  .all(handle405s);

module.exports = apiRouter;
