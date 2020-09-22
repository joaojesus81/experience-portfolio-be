const projectsRouter = require("express").Router();

const { handle405s } = require("../errors");

const {
  sendProjectsByStaffID,
  sendProjects,
  sendStaffListForProjects,
} = require("../controllers/projects.controllers");

const {
  sendKeywordsByStaffID,
} = require("../controllers/keywords.controllers");

const { sendStaffForProjects } = require("../controllers/staff.controllers");

projectsRouter.route("/").get(sendProjects).all(handle405s);

projectsRouter
  .route("/staff")
  .get(sendStaffListForProjects)
  .post(sendStaffForProjects)
  .all(handle405s);

projectsRouter
  .route("/staff/:StaffID")
  .get(sendProjectsByStaffID)
  .all(handle405s);

projectsRouter
  .route("/keywords/:StaffID")
  .get(sendKeywordsByStaffID)
  .all(handle405s);

module.exports = projectsRouter;
