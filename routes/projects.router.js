const projectsRouter = require("express").Router();

const { handle405s } = require("../errors");

const {
  sendProjectsByStaffID,
} = require("../controllers/projects.controllers");

projectsRouter
  .route("/staff/:StaffID")
  .get(sendProjectsByStaffID)
  .all(handle405s);

module.exports = projectsRouter;
