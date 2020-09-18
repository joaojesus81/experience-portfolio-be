const {
  keywordGroupsData,
  keywordListData,
  keywordThesaurusData,
  projectsData,
  projectKeywordsData,
  staffMeta,
  staffExperience,
} = require("../data/index.js");

const {
  formatProjects,
  filterStaffTime,
  formatKeywords,
  formatStaffMeta,
} = require("../utils/dataFormatting");

exports.seed = function (knex) {
  let projectCodeArray = [];
  console.log("seeding");
  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      return knex("keywordGroups")
        .insert(keywordGroupsData)
        .then(() => {
          const formattedKeywords = formatKeywords(keywordListData);
          return knex("keywordList").insert(formattedKeywords);
        })
        .then(() => {
          return knex("keywordThesaurus").insert(keywordThesaurusData);
        })
        .then(() => {
          //&&&const formattedProjects = formatProjects(projectsData);
          const formattedProjects = formatProjects(
            projectsData,
            projectKeywordsData,
            keywordThesaurusData
          );

          return knex("projects")
            .insert(formattedProjects)
            .returning("ProjectCode");
        })
        .then((projectCodes) => {
          projectCodeArray = projectCodes;
          return knex("projectKeywords").insert(projectKeywordsData);
        })
        .then(() => {
          const formatttedStaffMeta = formatStaffMeta(staffMeta);
          return knex("staffMeta")
            .insert(formatttedStaffMeta)
            .returning("StaffID");
        })
        .then((staffIDArray) => {
          const formattedStaff = filterStaffTime(
            staffExperience,
            staffIDArray,
            projectCodeArray
          );
          return knex("staffExperience").insert(formattedStaff);
        });
    });
};
