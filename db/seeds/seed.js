const {
  keywordGroupsData,
  keywordListData,
  keywordThesaurusData,
  projectsData,
  projectKeywordsData,
  staffMeta,
  staffExperience,
} = require("../data/index.js");

const { formatProjects, filterStaffTime } = require("../utils/dataFormatting");

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
          return knex("keywordList").insert(keywordListData);
        })
        .then(() => {
          return knex("keywordThesaurus").insert(keywordThesaurusData);
        })
        .then(() => {
          const formattedProjects = formatProjects(projectsData);
          return knex("projects")
            .insert(formattedProjects)
            .returning("ProjectCode");
        })
        .then((projectCodes) => {
          projectCodeArray = projectCodes;
          return knex("projectKeywords").insert(projectKeywordsData);
        })
        .then(() => {
          return knex("staffMeta").insert(staffMeta).returning("StaffID");
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
