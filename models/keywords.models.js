const knex = require("../connection");

const fetchKeywordGroups = () => {
  return knex.select("*").from("keywordGroups").returning("*");
};

const fetchKeywords = (filters) => {
  return knex
    .select("*")
    .from("keywordList")
    .modify((query) => {
      query.where(filters);
    })
    .returning("*");
};

const uniqueArray = (array) => {
  const seen = {};
  return array.filter(function (item) {
    return seen.hasOwnProperty(item) ? false : (seen[item] = true);
  });
};

const fetchRelatedKeywords = (keywordArray) => {
  return knex
    .select("KeywordCode", "RelatedKeywordCode")
    .from("keywordThesaurus")
    .whereIn("keywordThesaurus.KeywordCode", keywordArray)
    .then((relatedKeywordArray) => {
      const allKeywords = [];
      relatedKeywordArray.forEach((keyword) => {
        allKeywords.push(keyword.KeywordCode);
        allKeywords.push(keyword.RelatedKeywordCode);
      });
      const uniqueKeywords = uniqueArray(allKeywords);
      uniqueKeywords.sort();
      return uniqueKeywords;
    });
};

const fetchKeywordsByProjectCode = (ProjectCode, filters) => {
  const { includeRelated } = filters;

  return knex
    .select("KeywordCode")
    .from("projectKeywords")
    .where("projectKeywords.ProjectCode", ProjectCode)
    .orderBy("KeywordCode", "asc")
    .then((keywordArray) => {
      const keywords = keywordArray.map((keywordObject) => {
        return keywordObject.KeywordCode;
      });
      return keywords;
    })
    .then((keywordArray) => {
      if (includeRelated) {
        return fetchRelatedKeywords(keywordArray);
      } else return keywordArray;
    });
};

module.exports = {
  fetchKeywordGroups,
  fetchKeywords,
  fetchKeywordsByProjectCode,
};
