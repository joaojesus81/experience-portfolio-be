const staffMetaRouter = require("express").Router();

const { handle405s } = require("../errors");

const {
  sendStaffMetaByID,
  updateStaffMetaByID,
  updateStaffPhotoByID,
} = require("../controllers/staff.controllers");

staffMetaRouter
  .route("/:StaffID")
  .get(sendStaffMetaByID)
  .patch(updateStaffMetaByID)
  .post(updateStaffPhotoByID)
  .all(handle405s);

module.exports = staffMetaRouter;
