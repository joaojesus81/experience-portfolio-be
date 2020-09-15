const knex = require("../connection");

const { fetchProjectByProjectCode } = require("./projects.models");

//Validate on the front end
// function validateColumns(columnsToUpdate) {
//   return (
//     columnsToUpdate.includes("StaffName") ||
//     columnsToUpdate.includes("Email") ||
//     columnsToUpdate.includes("LocationName") ||
//     columnsToUpdate.includes("StartDate") ||
//     columnsToUpdate.includes("JobTitle") ||
//     columnsToUpdate.includes("GradeLevel") ||
//     columnsToUpdate.includes("DisciplineName")
//   );
// }

const checkStaffIDExists = (StaffID) => {
  return knex
    .select("StaffID")
    .from("staffMeta")
    .where("staffMeta.StaffID", StaffID)
    .then((staffMeta) => {
      if (staffMeta.length === 0) {
        return Promise.reject({ status: 404, msg: "StaffID not found" });
      } else {
        return true;
      }
    });
};

const fetchStaffMetaByID = (StaffID) => {
  return knex
    .select("*")
    .from("staffMeta")
    .where("staffMeta.StaffID", StaffID)
    .then((staffMeta) => {
      if (staffMeta.length === 0) {
        return Promise.reject({ status: 404, msg: "StaffID not found" });
      } else {
        return staffMeta[0];
      }
    });
};

const patchStaffMetaByID = (StaffID, metaData) => {
  const columnsToUpdate = Object.keys(metaData);
  console.log("patching");

  //Validate on the front end
  // if (validateColumns(columnsToUpdate)) {
  //   return Promise.reject({
  //     status: 422,
  //     msg: "Arup projects fields should be updated on central systems!!!",
  //   });
  // }

  return knex
    .from("staffMeta")
    .where("staffMeta.StaffID", StaffID)
    .update(metaData, columnsToUpdate)
    .then((staffMeta) => {
      if (staffMeta.length === 0) {
        return Promise.reject({ status: 404, msg: "StaffID not found" });
      } else {
        return fetchStaffMetaByID(StaffID);
      }
    });
};

const patchStaffExperienceOnProject = (ProjectCode, StaffID, experience) => {
  if (!StaffID)
    return Promise.reject({
      status: 404,
      msg: "No staff id provided!!!",
    });
  return checkStaffIDExists(StaffID).then(() => {
    const columnsToUpdate = Object.keys(experience);
    return knex
      .from("staffExperience")
      .where({ StaffID: StaffID, ProjectCode: ProjectCode })
      .update(experience, columnsToUpdate)
      .then((staffExperience) => {
        if (staffExperience.length === 0) {
          return Promise.reject({
            status: 404,
            msg:
              "No staff time booked to project - use add experience instead!!!",
          });
        } else {
          return fetchProjectByProjectCode(ProjectCode, StaffID);
        }
      });
  });
};

module.exports = {
  fetchStaffMetaByID,
  patchStaffMetaByID,
  patchStaffExperienceOnProject,
};
