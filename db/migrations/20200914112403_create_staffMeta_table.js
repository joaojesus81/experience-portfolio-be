exports.up = function (knex) {
  console.log("creating staffmeta");
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
    staffMetaTable.specificType("qualifications", "text[]");
    staffMetaTable.specificType("professionalAssociations", "text[]");
    staffMetaTable.specificType("committees", "text[]");
    staffMetaTable.specificType("publications", "text[]");
    staffMetaTable.text("highLevelDescription");
    staffMetaTable.text("valueStatement");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("staffMeta");
};
