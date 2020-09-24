exports.up = function (knex) {
  console.log("creating keywordThestable");
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
  return knex.schema.dropTable("keywordThesaurus");
};
