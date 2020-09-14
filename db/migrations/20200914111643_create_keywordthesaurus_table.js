exports.up = function (knex) {
  console.log("creating keywordThesaurus table");
  return knex.schema.createTable(
    "keywordThesaurus",
    (keywordThesaurusTable) => {
      keywordThesaurusTable.increments("keywordThesaurusID");
      keywordThesaurusTable
        .string("KeywordCode")
        .references("keywordList.KeywordCode");
      keywordThesaurusTable
        .string("RelatedKeywordCode")
        .references("keywordList.KeywordCode");
    }
  );
};

exports.down = function (knex) {
  console.log("dropping keywordThesaurus table");
  return knex.schema.dropTable("keywordThesaurus");
};
