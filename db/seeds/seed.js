const {
  keywordGroupsData,
  keywordListData,
  keywordThesaurusData,
  projectsData,
  projectKeywordsData,
} = require("../data/index.js");

const { formatProjects } = require("../utils/dataFormatting");

exports.seed = function (knex) {
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
          return knex("projects").insert(formattedProjects);
        })
        .then(() => {
          //return knex("projectKeywords").insert(projectKeywordsData);
        });
    });
};
