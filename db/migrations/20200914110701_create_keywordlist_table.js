exports.up = function (knex) {
  console.log("creating keywordList table");
  return knex.schema.createTable("keywordList", (keywordListTable) => {
    keywordListTable.string("KeywordCode").notNullable().primary();
    keywordListTable.string("Keyword").notNullable();
    keywordListTable
      .string("KeywordGroupCode")
      .references("keywordGroups.KeywordGroupCode");
  });
};

exports.down = function (knex) {
  console.log("dropping keywordList table");
  return knex.schema.dropTable("keywordList");
};
