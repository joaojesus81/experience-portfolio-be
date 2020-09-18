const projectRouter = require("express").Router();

const { handle405s } = require("../errors");

const {
  sendProjectByProjectCode,
  updateProjectDetails,
  updateProjectImage,
  removeProjectImage,
} = require("../controllers/projects.controllers");

const {
  updateStaffExperienceOnProject,
  addStaffExperienceOnProject,
} = require("../controllers/staff.controllers");

const {
  sendKeywordsByProjectCode,
} = require("../controllers/keywords.controllers");

projectRouter
  .route("/:ProjectCode")
  .get(sendProjectByProjectCode)
  .patch(updateProjectDetails)
  .post(updateProjectImage)
  .delete(removeProjectImage)
  .all(handle405s);

projectRouter
  .route("/staff/:ProjectCode")
  .patch(updateStaffExperienceOnProject)
  .post(addStaffExperienceOnProject)
  .all(handle405s);

projectRouter
  .route("/keywords/:ProjectCode")
  .get(sendKeywordsByProjectCode)
  .all(handle405s);

module.exports = projectRouter;
