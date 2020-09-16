const {
  fetchProjectsByStaffID,
  fetchProjectByProjectCode,
  patchProjectData,
  fetchProjects,
  postProjectImage,
} = require("../models/projects.models");

const sendProjects = (req, res, next) => {
  const filters = req.query;
  fetchProjects(filters)
    .then((projects) => {
      res.status(200).send({ projects });
    })
    .catch((err) => {
      next(err);
    });
};

const sendProjectsByStaffID = (req, res, next) => {
  const { StaffID } = req.params;
  const filters = req.query;
  fetchProjectsByStaffID(StaffID, filters)
    .then((projects) => {
      res.status(200).send({ projects });
    })
    .catch((err) => {
      next(err);
    });
};

const sendProjectByProjectCode = (req, res, next) => {
  const { ProjectCode } = req.params;
  const { StaffID } = req.query;
  fetchProjectByProjectCode(ProjectCode, StaffID)
    .then((project) => {
      res.status(200).send({ project });
    })
    .catch((err) => {
      next(err);
    });
};

const updateProjectDetails = (req, res, next) => {
  const { ProjectCode } = req.params;
  const projectData = req.body;

  patchProjectData(ProjectCode, projectData)
    .then((project) => {
      res.status(200).send({ project });
    })
    .catch((err) => {
      next(err);
    });
};

const updateProjectImage = (req, res, next) => {
  if (req.files) {
    const values = Object.values(req.files);
    const { ProjectCode } = req.params;

    postProjectImage(ProjectCode, values)
      .then((uploadedFileURL) => {
        const projectData = { imgURL: uploadedFileURL };
        patchProjectData(ProjectCode, projectData).then((project) => {
          res.status(201).send({ project });
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
  sendProjectsByStaffID,
  sendProjectByProjectCode,
  updateProjectDetails,
  sendProjects,
  updateProjectImage,
};
