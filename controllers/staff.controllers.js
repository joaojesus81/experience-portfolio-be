const {
  fetchStaffMetaByID,
  patchStaffMetaByID,
  patchStaffExperienceOnProject,
  postStaffExperienceOnProject,
  postStaffImage,
  fetchStaffMeta,
} = require("../models/staff.models");

const sendStaffMeta = (req, res, next) => {
  const filters = req.query;
  fetchStaffMeta(filters)
    .then((staffMeta) => {
      res.status(200).send({ staffMeta });
    })
    .catch((err) => {
      next(err);
    });
};

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

const addStaffExperienceOnProject = (req, res, next) => {
  const { ProjectCode } = req.params;
  const { StaffID } = req.query;
  const experience = req.body;
  postStaffExperienceOnProject(ProjectCode, StaffID, experience)
    .then((experience) => {
      res.status(200).send({ experience });
    })
    .catch((err) => {
      next(err);
    });
};

const updateStaffPhotoByID = (req, res, next) => {
  if (req.files) {
    const values = Object.values(req.files);
    const { StaffID } = req.params;

    postStaffImage(StaffID, values)
      .then((uploadedFileURL) => {
        const metaData = { imgURL: uploadedFileURL };
        patchStaffMetaByID(StaffID, metaData).then((staffMeta) => {
          res.status(201).send({ staffMeta });
        });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    err = { status: 400, msg: "no files provided" };
    next(err);
  }
};

module.exports = {
  sendStaffMetaByID,
  updateStaffMetaByID,
  updateStaffExperienceOnProject,
  addStaffExperienceOnProject,
  updateStaffPhotoByID,
  sendStaffMeta,
};
