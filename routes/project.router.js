const projectRouter = require("express").Router();

const { handle405s } = require("../errors");

const {
  sendProjectByProjectCode,
  updateProjectDetails,
} = require("../controllers/projects.controllers");

const {
  updateStaffExperienceOnProject,
  addStaffExperienceOnProject,
} = require("../controllers/staff.controllers");

projectRouter
  .route("/:ProjectCode")
  .get(sendProjectByProjectCode)
  .patch(updateProjectDetails)
  .all(handle405s);

projectRouter
  .route("/staff/:ProjectCode")
  .patch(updateStaffExperienceOnProject)
  .post(addStaffExperienceOnProject)
  .all(handle405s);

module.exports = projectRouter;
