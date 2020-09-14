const { projectsData } = require("../data/index.js");

const { formatProjects } = require("../utils/dataFormatting.js");

exports.seed = function (knex) {
  console.log("seeding");
  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      // const formattedProjects = formatProjects(projectsData);
      // return knex("projects")
      //   .insert(projectsData)
      //   .returning(["ProjectCode"])
      //   .then((ProjectCode) => {
      //     console.log(ProjectCode);
      //     //return knex("keywords").insert(projectsData);
      //   });
    });
};
