const knex = require("../connection");

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

const fetchProjectsByStaffID = (StaffID, showDetails) => {
  // We need sortBy and an order.
  // We need to filter by hours > a certain amount.
  // We need to filter by

  return checkStaffIDExists(StaffID).then((staffExists) => {
    if (!staffExists)
      return Promise.reject({ status: 404, msg: "StaffID not found" });
    return knex
      .select("*")
      .from("staffExperience")
      .modify((query) => {
        if (showDetails)
          query
            .leftJoin(
              "projects",
              "staffExperience.ProjectCode",
              "projects.ProjectCode"
            )
            .where("staffExperience.StaffID", StaffID)
            .orderBy("projects.ProjectCode", "asc");
      })
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
  });
};

const fetchProjectByProjectCode = (ProjectCode, StaffID) => {
  return checkStaffIDExists(StaffID).then((staffExists) => {
    if (!staffExists && StaffID)
      return Promise.reject({ status: 404, msg: "StaffID not found" });

    return checkStaffIDExists(StaffID).then(() => {
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

module.exports = { fetchProjectsByStaffID, fetchProjectByProjectCode };