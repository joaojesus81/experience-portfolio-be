const projectsRouter = require("express").Router();

const { handle405s } = require("../errors");

const {
  sendProjectsByStaffID,
  sendProjects,
} = require("../controllers/projects.controllers");

projectsRouter.route("/").get(sendProjects).all(handle405s);

projectsRouter
  .route("/staff/:StaffID")
  .get(sendProjectsByStaffID)
  .all(handle405s);

module.exports = projectsRouter;
