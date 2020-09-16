const staffMetaRouter = require("express").Router();

const { handle405s } = require("../errors");

const {
  sendStaffMetaByID,
  updateStaffMetaByID,
  updateStaffPhotoByID,
  sendStaffMeta,
} = require("../controllers/staff.controllers");

staffMetaRouter
  .route("/:StaffID")
  .get(sendStaffMetaByID)
  .patch(updateStaffMetaByID)
  .post(updateStaffPhotoByID)
  .all(handle405s);

staffMetaRouter.route("/").get(sendStaffMeta).all(handle405s);

module.exports = staffMetaRouter;
