exports.up = function (knex) {
  console.log("creating projkeywords");
  return knex.schema.createTable("projectKeywords", (projectKeywordsTable) => {
    projectKeywordsTable.increments("projectKeywordsID");
    projectKeywordsTable
      .integer("ProjectCode")
      .references("projects.ProjectCode");
    projectKeywordsTable
      .string("KeywordCode")
      .references("keywordList.KeywordCode");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("projectKeywords");
};
