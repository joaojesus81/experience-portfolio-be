exports.up = function (knex) {
  console.log("creating keywords table");
  return knex.schema.createTable("keywords", (keywordsTable) => {
    keywordsTable.integer("ProjectCode").references("projects.ProjectCode");
    keywordsTable.string("KeywordCode").notNullable().primary();
    keywordsTable.string("Keyword").notNullable();
  });
};

exports.down = function (knex) {
  console.log("dropping keywords table");
  return knex.schema.dropTable("keywords");
};
