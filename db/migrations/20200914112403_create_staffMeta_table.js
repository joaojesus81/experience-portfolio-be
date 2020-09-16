exports.up = function (knex) {
  console.log("creating staff meta table");
  return knex.schema.createTable("staffMeta", (staffMetaTable) => {
    staffMetaTable.integer("StaffID").notNullable().primary();
    staffMetaTable.string("StaffName").notNullable();
    staffMetaTable.string("Email");
    staffMetaTable.string("LocationName");
    staffMetaTable.timestamp("StartDate");
    staffMetaTable.string("JobTitle");
    staffMetaTable.integer("GradeLevel");
    staffMetaTable.string("DisciplineName");
    staffMetaTable.string("imgURL");
    staffMetaTable.timestamp("careerStart");
    staffMetaTable.string("nationality");
    staffMetaTable.string("qualifications");
    staffMetaTable.string("professionalAssociations");
    staffMetaTable.string("committees");
    staffMetaTable.text("publications");
    staffMetaTable.string("highLevelDescription");
    staffMetaTable.string("valueStatement");
  });
};

exports.down = function (knex) {
  console.log("dropping staff meta table");
  return knex.schema.dropTable("staffMeta");
};
