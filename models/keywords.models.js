const knex = require("../connection");

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

const fetchKeywordGroups = () => {
  return knex.select("*").from("keywordGroups").returning("*");
};

const fetchKeywords = (filters) => {
  const filterKeys = Object.keys(filters);
  return knex
    .select("*")
    .from("keywordList")
    .modify((query) => {
      if (filterKeys.length > 0) {
        query.where(filters);
      }
    })
    .returning("*");
};

const fetchKeywordsByProjectCode = (ProjectCode, filters) => {
  return checkProjectCodeExists(ProjectCode).then((projectExists) => {
    if (!projectExists)
      return Promise.reject({ status: 404, msg: "ProjectCode not found" });

    return knex
      .select("Keywords")
      .from("projects")
      .where("ProjectCode", ProjectCode)
      .orderBy("Keywords", "asc")
      .then((keywords) => {
        keywordsObj = { keywords: keywords[0].Keywords };
        return keywordsObj;
      });
  });
};

const fetchKeywordsByStaffID = (StaffID, filters) => {
  const filterKeys = Object.keys(filters);

  return checkStaffIDExists(StaffID).then((staffExists) => {
    if (!staffExists) {
      return Promise.reject({ status: 404, msg: "StaffID not found" });
    } else {
      return knex
        .select("*")
        .from("staffExperience")
        .leftJoin(
          "projects",
          "staffExperience.ProjectCode",
          "projects.ProjectCode"
        )
        .orderBy("projects.ProjectCode", "asc")
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
            const keywordsArr = [];

            projects.forEach((project) => {
              const keywords = project.Keywords;
              keywords.forEach((keyword) => {
                if (!keywordsArr.includes(keyword)) keywordsArr.push(keyword);
              });
            });
            keywordsArr.sort();
            return keywordsArr;
          }
        });
    }
  });
};

module.exports = {
  fetchKeywordGroups,
  fetchKeywords,
  fetchKeywordsByProjectCode,
  fetchKeywordsByStaffID,
};
