const apiRouter = require("express").Router();
const staffRouter = require("./staff.router");
const projectsRouter = require("./projects.router");
const projectRouter = require("./project.router");
// const usersRouter = require("./users.router");
// const articlesRouter = require("./articles.router");
// const commentsRouter = require("./comments.router");
const sendAPIs = require("../controllers/apis.controllers");

const { handle405s } = require("../errors");

apiRouter.use("/staff", staffRouter);
apiRouter.use("/projects", projectsRouter);
apiRouter.use("/project", projectRouter);
// apiRouter.use("/users", usersRouter);
// apiRouter.use("/articles", articlesRouter);
// apiRouter.use("/comments", commentsRouter);

apiRouter.route("/").get(sendAPIs).all(handle405s);

module.exports = apiRouter;
