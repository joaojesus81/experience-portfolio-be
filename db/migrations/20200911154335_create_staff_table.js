exports.up = function (knex) {
  console.log("creating staff meta table");
  return knex.schema.createTable("staffMeta", (staffMetaTable) => {
    staffMetaTable.integer("StaffID").notNullable().primary();
    staffMetaTable.string("StaffName").notNullable();
    staffMetaTable.string("Email");
    staffMetaTable.string("LocationName");
    staffMetaTable.date("StartDate");
    staffMetaTable.string("JobTitle");
    staffMetaTable.integer("GradeLevel");
    staffMetaTable.string("DisciplineName");
    staffMetaTable.string("imgUrl");
    staffMetaTable.date("careerStart");
    staffMetaTable.string("nationality");
  });
};

exports.down = function (knex) {
  console.log("dropping staff meta table");
  return knex.schema.dropTable("staffMeta");
};
