exports.up = function (knex) {
  console.log("creating keywordGroups table");
  return knex.schema.createTable("keywordGroups", (keywordGroupTable) => {
    keywordGroupTable.string("KeywordGroupCode").notNullable().primary();
    keywordGroupTable.string("KeywordGroupName").notNullable();
  });
};

exports.down = function (knex) {
  console.log("dropping keywordGroups table");
  return knex.schema.dropTable("keywordGroups");
};
