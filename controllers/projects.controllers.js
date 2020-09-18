const {
  fetchProjectsByStaffID,
  fetchProjectByProjectCode,
  patchProjectData,
  fetchProjects,
  postProjectImage,
  deleteProjectImage,
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
    const promiseArray = [
      postProjectImage(ProjectCode, values),
      fetchProjectByProjectCode(ProjectCode),
    ];

    return Promise.all(promiseArray)
      .then((promiseArr) => {
        const uploadedFileURL = promiseArr[0];
        const imageURLs = promiseArr[1].imgURL;

        if (!imageURLs.includes(uploadedFileURL)) {
          imageURLs.push(uploadedFileURL);
          //This next line tells patchProjectData that it is ok to patch the imgURLs
          imageURLs.push("sent by upload");
          const projectData = { imgURL: imageURLs };
          return patchProjectData(ProjectCode, projectData).then((project) => {
            res.status(201).send({ project });
          });
        } else {
          const project = promiseArr[1];
          res.status(201).send({ project });
        }
      })
      .catch((err) => {
        next(err);
      });
  } else {
    err = { status: 400, msg: "no files provided" };
    next(err);
  }
};

const removeProjectImage = (req, res, next) => {
  const { ProjectCode } = req.params;
  const { imgURL } = req.body;

  deleteProjectImage(imgURL)
    .then((message) => {
      console.log(message, "message");
      return fetchProjectByProjectCode(ProjectCode).then((project) => {
        res.status(200).send({ project });
      });
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
  updateProjectImage,
  removeProjectImage,
};
