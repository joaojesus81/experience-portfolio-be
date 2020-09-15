const projectRouter = require("express").Router();

const { handle405s } = require("../errors");

const {
  sendProjectByProjectCode,
} = require("../controllers/projects.controllers");

const {
  updateStaffExperienceOnProject,
} = require("../controllers/staff.controllers");

projectRouter
  .route("/:ProjectCode")
  .get(sendProjectByProjectCode)
  .patch(updateStaffExperienceOnProject)
  .all(handle405s);

module.exports = projectRouter;
