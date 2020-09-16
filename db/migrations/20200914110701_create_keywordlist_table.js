exports.up = function (knex) {
  return knex.schema.createTable("keywordList", (keywordListTable) => {
    keywordListTable.string("KeywordCode").notNullable().primary();
    keywordListTable.string("Keyword").notNullable();
    keywordListTable
      .string("KeywordGroupCode")
      .references("keywordGroups.KeywordGroupCode");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("keywordList");
};
