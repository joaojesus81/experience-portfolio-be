const {
  fetchProjectsByStaffID,
  fetchProjectByProjectCode,
  patchProjectData,
  fetchProjects,
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
  const { showDetails = false } = req.query;
  fetchProjectsByStaffID(StaffID, showDetails)
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

module.exports = {
  sendProjectsByStaffID,
  sendProjectByProjectCode,
  updateProjectDetails,
  sendProjects,
};
