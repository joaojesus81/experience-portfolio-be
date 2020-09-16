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

module.exports = { fetchKeywordGroups, fetchKeywords };
