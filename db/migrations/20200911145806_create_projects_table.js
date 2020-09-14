exports.up = function (knex) {
  console.log("creating projects table");
  return knex.schema.createTable("projects", (projectsTable) => {
    projectsTable.integer("ProjectCode").primary().unique().notNullable();
    projectsTable.string("JobNameLong").notNullable();
    projectsTable.date("StartDate");
    projectsTable.date("EndDate");
    projectsTable.string("CentreName");
    projectsTable.integer("AccountingCentreCode");
    projectsTable.string("PracticeName");
    projectsTable.string("BusinessCode");
    projectsTable.string("BusinessName");
    projectsTable.integer("ProjectDirectorID");
    projectsTable.string("ProjectDirectorName");
    projectsTable.integer("ProjectManagerID");
    projectsTable.string("ProjectManagerName");
    projectsTable.string("CountryName");
    projectsTable.string("Town");
    projectsTable.string("State");
    projectsTable.decimal("Latitude");
    projectsTable.decimal("Longitude");
    projectsTable.string("ScopeOfService");
    projectsTable.string("ScopeOfWorks");
    projectsTable.integer("PercentComplete");
    projectsTable.integer("ClientID");
    projectsTable.string("ClientName");
    projectsTable.string("ProjectURL");
    projectsTable.boolean("Confidential");
  });
};

exports.down = function (knex) {
  console.log("creating projects table");
  return knex.schema.dropTable("projects");
};
