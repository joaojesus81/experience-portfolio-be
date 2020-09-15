const projectRouter = require("express").Router();

const { handle405s } = require("../errors");

const {
  sendProjectByProjectCode,
} = require("../controllers/projects.controllers");

const {
  updateStaffExperienceOnProject,
  addStaffExperienceOnProject,
} = require("../controllers/staff.controllers");

projectRouter
  .route("/:ProjectCode")
  .get(sendProjectByProjectCode)
  .patch(updateStaffExperienceOnProject)
  .post(addStaffExperienceOnProject)
  .all(handle405s);

module.exports = projectRouter;
