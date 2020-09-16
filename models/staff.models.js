const knex = require("../connection");

const cloudinary = require("cloudinary").v2;

const { fetchProjectByProjectCode } = require("./projects.models");

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

const validateStaffExperience = (ProjectCode, StaffID) => {
  if (!StaffID)
    return Promise.reject({
      status: 404,
      msg: "No staff id provided!!!",
    });
  return checkStaffIDExists(StaffID).then((staffExists) => {
    if (!staffExists) {
      return Promise.reject({ status: 404, msg: "StaffID not found" });
    }
    return checkProjectCodeExists(ProjectCode).then((projectExists) => {
      if (!projectExists) {
        return Promise.reject({ status: 404, msg: "ProjectCode not found" });
      }
      return true;
    });
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
  return validateStaffExperience(ProjectCode, StaffID).then((isValid) => {
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

const postStaffExperienceOnProject = (ProjectCode, StaffID, experience) => {
  return validateStaffExperience(ProjectCode, StaffID).then((isValid) => {
    const columnsToUpdate = Object.keys(experience);

    if (
      !columnsToUpdate.includes("experience") ||
      !columnsToUpdate.includes("TotalHrs")
    ) {
      return Promise.reject({
        status: 404,
        msg: "Missing attributes!!!",
      });
    }

    const experienceToInsert = {
      TotalHrs: experience.TotalHrs,
      StaffID: StaffID,
      ProjectCode: ProjectCode,
      experience: experience.experience,
    };

    return knex("staffExperience")
      .insert(experienceToInsert)
      .returning("*")
      .then((experienceArray) => {
        const newExperience = experienceArray[0];
        newExperience.TotalHrs = parseFloat(newExperience.TotalHrs);
        return newExperience;
      });
  });
};

const postStaffImage = (StaffID, values) => {
  const image = values[0];

  const imageName = image.name.replace(/\.[^/.]+$/, "");
  const options = {
    upload_preset: "expportpreset",
    folder: "expport/staffPics",
    public_id: imageName,
  };
  return cloudinary.uploader
    .upload(image.path, options)
    .then((uploadedFile) => {
      return uploadedFile.secure_url;
    });
};

module.exports = {
  fetchStaffMetaByID,
  patchStaffMetaByID,
  patchStaffExperienceOnProject,
  postStaffExperienceOnProject,
  postStaffImage,
};
