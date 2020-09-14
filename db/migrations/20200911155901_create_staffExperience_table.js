exports.up = function (knex) {
  console.log("creating staff experience table");
  return knex.schema.createTable("staffExperience", (staffExperienceTable) => {
    staffExperienceTable.increments("experienceID");
    staffExperienceTable
      .integer("ProjectCode")
      .references("projects.ProjectCode");
    staffExperienceTable.integer("StaffID").references("staffMeta.StaffID");
    staffExperienceTable.decimal("TotalHrs");
    staffExperienceTable.string("experience");
  });
};

exports.down = function (knex) {
  console.log("dropping staff meta table");
  return knex.schema.dropTable("staffExperience");
};
