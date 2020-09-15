const {
  fetchStaffMetaByID,
  patchStaffMetaByID,
  patchStaffExperienceOnProject,
} = require("../models/staff.models");

const sendStaffMetaByID = (req, res, next) => {
  const { StaffID } = req.params;
  fetchStaffMetaByID(StaffID)
    .then((staffMeta) => {
      res.status(200).send({ staffMeta });
    })
    .catch((err) => {
      next(err);
    });
};

const updateStaffMetaByID = (req, res, next) => {
  const { StaffID } = req.params;
  const metaData = req.body;
  patchStaffMetaByID(StaffID, metaData)
    .then((staffMeta) => {
      res.status(200).send({ staffMeta });
    })
    .catch((err) => {
      next(err);
    });
};

const updateStaffExperienceOnProject = (req, res, next) => {
  const { ProjectCode } = req.params;
  const { StaffID } = req.query;
  const experience = req.body;
  patchStaffExperienceOnProject(ProjectCode, StaffID, experience)
    .then((project) => {
      res.status(200).send({ project });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  sendStaffMetaByID,
  updateStaffMetaByID,
  updateStaffExperienceOnProject,
};
