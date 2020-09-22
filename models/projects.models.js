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

const checkKeywordFilters = (filters) => {
  let keywordFilters = [];
  let KeywordQueryType = "";

  if (filters.hasOwnProperty("Keywords")) {
    keywordFilters = filters.Keywords.split(";");
    delete filters.Keywords;
    if (filters.hasOwnProperty("KeywordQueryType")) {
      KeywordQueryType = filters.KeywordQueryType;
      delete filters.KeywordQueryType;
    } else {
      KeywordQueryType = "AND";
    }
  }
  return { KeywordQueryType: KeywordQueryType, keywordFilters: keywordFilters };
};

const checkFilters = (filters) => {
  let StartDateAfter = "";
  let EndDateBefore = "";
  let EndDateAfter = "";
  let PercentComplete = null;
  let includeConfidential = false;

  if (filters.hasOwnProperty("StartDateAfter")) {
    StartDateAfter = filters.StartDateAfter;
    delete filters.StartDateAfter;
  }
  if (filters.hasOwnProperty("EndDateBefore")) {
    EndDateBefore = filters.EndDateBefore;
    delete filters.EndDateBefore;
  }
  if (filters.hasOwnProperty("EndDateAfter")) {
    EndDateAfter = filters.EndDateAfter;
    delete filters.EndDateAfter;
  }
  if (filters.hasOwnProperty("PercentComplete")) {
    PercentComplete = filters.PercentComplete;
    delete filters.PercentComplete;
  }
  if (filters.hasOwnProperty("includeConfidential")) {
    includeConfidential = filters.includeConfidential;
    delete filters.includeConfidential;
  }

  return {
    StartDateAfter: StartDateAfter,
    EndDateBefore: EndDateBefore,
    EndDateAfter: EndDateAfter,
    PercentComplete: PercentComplete,
    includeConfidential: includeConfidential,
  };
};

const fetchProjects = (filters) => {
  const { KeywordQueryType, keywordFilters } = checkKeywordFilters(filters);
  const {
    StartDateAfter,
    EndDateBefore,
    EndDateAfter,
    PercentComplete,
    includeConfidential,
  } = checkFilters(filters);

  const filterKeys = Object.keys(filters);

  return knex
    .select("*")
    .from("projects")
    .returning("*")
    .modify((query) => {
      if (filterKeys.length > 0) {
        query.where(filters);
      }
      if (keywordFilters.length > 0) {
        if (KeywordQueryType === "OR" && keywordFilters.length > 1) {
          query.where("Keywords", "&&", keywordFilters);
        } else {
          query.where("Keywords", "@>", keywordFilters);
        }
      }
      if (StartDateAfter !== "") {
        query.where("StartDate", ">", StartDateAfter);
      }
      if (EndDateBefore !== "") {
        query.where("EndDate", "<", EndDateBefore);
      }
      if (EndDateAfter !== "") {
        query.where("EndDate", ">", EndDateAfter);
      }
      if (PercentComplete !== null) {
        query.where("PercentComplete", ">=", PercentComplete);
      }
      if (includeConfidential === false) {
        query.where("Confidential", false);
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
  const { KeywordQueryType, keywordFilters } = checkKeywordFilters(filters);

  const {
    StartDateAfter,
    EndDateBefore,
    EndDateAfter,
    PercentComplete,
    includeConfidential,
  } = checkFilters(filters);

  let showDetails = false;
  if (Object.keys(filters).includes("showDetails")) {
    if (filters.showDetails === "true" || filters.showDetails === true)
      showDetails = true;
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
          if (
            showDetails ||
            filterKeys.length > 0 ||
            keywordFilters.length > 0 ||
            (StartDateAfter + EndDateBefore + EndDateAfter + PercentComplete)
              .length > 0 ||
            includeConfidential !== true
          ) {
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
          if (keywordFilters.length > 0) {
            if (KeywordQueryType === "OR" && keywordFilters.length > 1) {
              query.where("projects.Keywords", "&&", keywordFilters);
            } else {
              query.where("projects.Keywords", "@>", keywordFilters);
            }
          }
          if (StartDateAfter !== "") {
            query.where("projects.StartDate", ">", StartDateAfter);
          }
          if (EndDateBefore !== "") {
            query.where("projects.EndDate", "<", EndDateBefore);
          }
          if (EndDateAfter !== "") {
            query.where("projects.EndDate", ">", EndDateAfter);
          }
          if (PercentComplete !== null) {
            query.where("projects.PercentComplete", ">=", PercentComplete);
          }
          if (includeConfidential === false) {
            query.where("projects.Confidential", false);
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
  if (columnsToUpdate.includes("Keywords")) delete projectData.Keywords;
  if (columnsToUpdate.includes("imgURL")) {
    if (!Array.isArray(projectData.imgURL)) {
      delete projectData.imgURL;
    } else if (
      projectData.imgURL.length === 1 &&
      projectData.imgURL[0] !== "sent by upload"
    ) {
      delete projectData.imgURL;
    } else {
      const lastItem = projectData.imgURL.pop();
      if (lastItem !== "sent by upload") {
        delete projectData.imgURL;
      }
    }
  }

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

    const imageName = `${ProjectCode}-${image.name.replace(/\.[^/.]+$/, "")}`;

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

const deleteProjectImage = (imgURL) => {
  const lastSlash = imgURL.lastIndexOf("/");
  const fileName = imgURL.slice(lastSlash + 1);
  const imageName = fileName.replace(/\.[^/.]+$/, "");
  return cloudinary.uploader.destroy(
    `expport/projectPics/${imageName}`,
    function (result) {
      return result;
    }
  );
};

module.exports = {
  fetchProjectsByStaffID,
  fetchProjectByProjectCode,
  patchProjectData,
  fetchProjects,
  postProjectImage,
  deleteProjectImage,
};
