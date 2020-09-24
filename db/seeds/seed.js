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
          console.log("seeded keywordGroups");
          const formattedKeywords = formatKeywords(keywordListData);
          return knex("keywordList").insert(formattedKeywords);
        })
        .then(() => {
          console.log("seeded keywordList");
          return knex("keywordThesaurus").insert(keywordThesaurusData);
        })
        .then(() => {
          console.log("seeded keywordThesaurus");
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
          console.log("seeded projects");
          projectCodeArray = projectCodes;
          return knex("projectKeywords").insert(projectKeywordsData);
        })
        .then(() => {
          console.log("seeded projectKeywords");
          const formatttedStaffMeta = formatStaffMeta(staffMeta);
          return knex("staffMeta")
            .insert(formatttedStaffMeta)
            .returning("StaffID");
        })
        .then((staffIDArray) => {
          console.log("seeded StaffID");
          console.log(staffIDArray);
          const formattedStaff = filterStaffTime(
            staffExperience,
            staffIDArray,
            projectCodeArray
          );
          return knex("staffExperience")
            .insert(formattedStaff)
            .then(() => {
              console.log("seeded staffExperience");
            });
        });
    });
};
