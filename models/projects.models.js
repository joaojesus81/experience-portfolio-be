const knex = require("../connection");
const cloudinary = require("cloudinary").v2;

const checkStaffIDExists = (StaffID = 0) => {
  return knex
    .select("StaffID")
    .from("staffMeta")
    .where("staffMeta.StaffID", StaffID)
    .then((staffMeta) => {
      if (staffMeta.length === 0) {
        return false;
      } else {
        return true;
      }
    });
};

const checkProjectCodeExists = (ProjectCode) => {
  return knex
    .select("ProjectCode")
    .from("projects")
    .where("projects.ProjectCode", ProjectCode)
    .then((projects) => {
      if (projects.length === 0) {
        return false;
      } else {
        return true;
      }
    });
};

const parseDecimals = (projectArray) => {
  formatttedProjects = projectArray.map((project) => {
    for (dataField in project) {
      if (
        dataField === "TotalHrs" ||
        dataField === "Latitude" ||
        dataField === "Longitude" ||
        dataField === "PercentComplete"
      ) {
        project[dataField] = parseFloat(project[dataField]);
      }
    }
    return project;
  });
  return formatttedProjects;
};

const fetchProjects = (filters) => {
  const filterKeys = Object.keys(filters);
  return knex
    .select("*")
    .from("projects")
    .returning("*")
    .modify((query) => {
      if (filterKeys.length > 0) {
        query.where(filters);
      }
    })

    .then((projects) => {
      if (projects.length === 0) {
        return Promise.reject({
          status: 200,
          msg: "No matching projects found",
        });
      } else {
        return parseDecimals(projects);
      }
    });
};

const fetchProjectsByStaffID = (StaffID, filters) => {
  // We need sortBy and an order.
  let showDetails = false;
  if (Object.keys(filters).includes("showDetails")) {
    if (filters.showDetails === "true") showDetails = true;
    delete filters.showDetails;
  }

  const filterKeys = Object.keys(filters);

  return checkStaffIDExists(StaffID).then((staffExists) => {
    if (!staffExists) {
      return Promise.reject({ status: 404, msg: "StaffID not found" });
    } else {
      return knex
        .select("*")
        .from("staffExperience")
        .modify((query) => {
          if (showDetails || filterKeys.length > 0) {
            query
              .leftJoin(
                "projects",
                "staffExperience.ProjectCode",
                "projects.ProjectCode"
              )
              .orderBy("projects.ProjectCode", "asc");
          }
        })
        .modify((query) => {
          if (filterKeys.length > 0) {
            query.where(filters);
          }
        })
        .where("staffExperience.StaffID", StaffID)
        .returning("*")
        .then((projects) => {
          if (projects.length === 0) {
            return Promise.reject({
              status: 200,
              msg: "No matching projects found",
            });
          } else {
            return parseDecimals(projects);
          }
        });
    }
  });
};

const fetchProjectByProjectCode = (ProjectCode, StaffID) => {
  return checkStaffIDExists(StaffID).then((staffExists) => {
    if (!staffExists && StaffID)
      return Promise.reject({ status: 404, msg: "StaffID not found" });

    return checkProjectCodeExists(ProjectCode).then((projectExists) => {
      if (!projectExists)
        return Promise.reject({ status: 404, msg: "ProjectCode not found" });

      return knex
        .select("*")
        .from("projects")
        .where("projects.ProjectCode", ProjectCode)
        .modify((query) => {
          if (StaffID)
            query
              .leftJoin(
                "staffExperience",
                "projects.ProjectCode",
                "staffExperience.ProjectCode"
              )
              .where("staffExperience.StaffID", StaffID);
        })
        .returning("*")
        .then((projects) => {
          if (projects.length === 0) {
            return Promise.reject({
              status: 200,
              msg: "No matching projects found",
            });
          } else {
            const projectArray = parseDecimals(projects);
            return projectArray[0];
          }
        });
    });
  });
};

const patchProjectData = (ProjectCode, projectData) => {
  const columnsToUpdate = Object.keys(projectData);
  if (columnsToUpdate.includes("JobNameLong"))
    projectData.JobNameLong = projectData.JobNameLong.toUpperCase();
  if (columnsToUpdate.includes("State"))
    projectData.State = projectData.State.toUpperCase();

  columnsToUpdate.forEach((column) => {
    if (
      column === "ScopeOfWorks" ||
      column === "imgURL" ||
      column === "Keywords"
    ) {
      projectData[column] = knex.raw(`array_append("${column}", ?)`, [
        `${projectData[column]}`,
      ]);
    }
  });

  return knex
    .select("*")
    .from("projects")
    .where("projects.ProjectCode", ProjectCode)
    .update(projectData)
    .then((projects) => {
      if (projects.length === 0) {
        return Promise.reject({ status: 404, msg: "ProjectCode not found" });
      } else {
        return fetchProjectByProjectCode(ProjectCode);
      }
    });
};

const postProjectImage = (ProjectCode, values) => {
  return checkProjectCodeExists(ProjectCode).then((projectExists) => {
    if (!projectExists)
      return Promise.reject({ status: 404, msg: "ProjectCode not found" });

    const image = values[0];

    const imageName = image.name.replace(/\.[^/.]+$/, "");
    const options = {
      upload_preset: "expportpreset",
      folder: "expport/projectPics",
      public_id: imageName,
    };
    return cloudinary.uploader
      .upload(image.path, options)
      .then((uploadedFile) => {
        return uploadedFile.secure_url;
      });
  });
};

module.exports = {
  fetchProjectsByStaffID,
  fetchProjectByProjectCode,
  patchProjectData,
  fetchProjects,
  postProjectImage,
};
