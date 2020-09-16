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
  return knex
    .select("*")
    .from("keywordList")
    .modify((query) => {
      query.where(filters);
    })
    .returning("*");
};

const uniqueArray = (array) => {
  const seen = {};
  return array.filter(function (item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
};

const fetchRelatedKeywords = (keywordArray) => {
  return knex
    .select("KeywordCode", "RelatedKeywordCode")
    .from("keywordThesaurus")
    .whereIn("keywordThesaurus.KeywordCode", keywordArray)
    .then((relatedKeywordArray) => {
      const allKeywords = [];
      relatedKeywordArray.forEach((keyword) => {
        allKeywords.push(keyword.KeywordCode);
        allKeywords.push(keyword.RelatedKeywordCode);
      });
      const uniqueKeywords = uniqueArray(allKeywords);
      uniqueKeywords.sort();
      return uniqueKeywords;
    });
};

const fetchKeywordsByProjectCode = (ProjectCode, filters) => {
  return checkProjectCodeExists(ProjectCode).then((projectExists) => {
    if (!projectExists)
      return Promise.reject({ status: 404, msg: "ProjectCode not found" });
    const { includeRelated } = filters;

    return knex
      .select("KeywordCode")
      .from("projectKeywords")
      .where("projectKeywords.ProjectCode", ProjectCode)
      .orderBy("KeywordCode", "asc")
      .then((keywordArray) => {
        const keywords = keywordArray.map((keywordObject) => {
          return keywordObject.KeywordCode;
        });
        return keywords;
      })
      .then((keywordArray) => {
        if (includeRelated) {
          return fetchRelatedKeywords(keywordArray);
        } else return keywordArray;
      });
  });
};

const fetchKeywordsByStaffID = (StaffID, filters) => {
  let showDetails = false;
  if (Object.keys(filters).includes("showDetails")) {
    showDetails = filters.showDetails;
    delete filters.showDetails;
  }
  if (Object.keys(filters).includes("includeKeywords")) {
    delete filters.includeKeywords;
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
            const promiseArray = projects.map((project) => {
              return fetchKeywordsByProjectCode(project.ProjectCode, {
                includeRelated: true,
              });
            });

            return Promise.all(promiseArray).then((keywords) => {
              const flattenedArray = [].concat(...keywords);
              const uniqueKeywords = uniqueArray(flattenedArray);

              uniqueKeywords.sort();

              return uniqueKeywords;
            });
          }
        });
    }
  });
};

const fetchKeywordsByStaffIDDBQuery = (StaffID, filters) => {
  const filterKeys = Object.keys(filters);

  return knex
    .select("*")
    .from("staffExperience")
    .modify((query) => {
      if (filterKeys.length > 0) {
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
    .returning("*");
};

module.exports = {
  fetchKeywordGroups,
  fetchKeywords,
  fetchKeywordsByProjectCode,
  fetchKeywordsByStaffID,
};
