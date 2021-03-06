exports.up = function (knex) {
  console.log("creating projects");
  return knex.schema.createTable("projects", (projectsTable) => {
    projectsTable.integer("ProjectCode").primary().unique().notNullable();
    projectsTable.string("JobNameLong").notNullable();
    projectsTable.timestamp("StartDate");
    projectsTable.timestamp("EndDate");
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
    projectsTable.text("ScopeOfService");
    //&&&projectsTable.text("ScopeOfWorks");
    projectsTable.specificType("ScopeOfWorks", "text[]");
    projectsTable.specificType("Keywords", "text[]");
    projectsTable.specificType("imgURL", "text[]");
    projectsTable.decimal("PercentComplete");
    projectsTable.integer("ClientID");
    projectsTable.string("ClientName");
    projectsTable.string("ProjectURL");
    projectsTable.boolean("Confidential");
    //&&&projectsTable.string("imgURL");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("projects");
};
