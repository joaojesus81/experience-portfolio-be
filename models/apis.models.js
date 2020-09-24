const fs = require("fs");
const knex = require("../connection");

exports.getAPIJSON = (cb) => {
  fs.readFile("./endpoints.json", "utf8", (err, apiJSON) => {
    cb(null, apiJSON);
  });
};

exports.getDBInfo = () => {
  const projectList = knex.select("ProjectCode").from("projects");
  const clientList = knex
    .select("ClientName")
    .from("projects")
    .groupBy("ClientName");

  const costCentreList = knex
    .select("CentreName")
    .from("projects")
    .groupBy("CentreName");
  const businessNameList = knex
    .select("BusinessName")
    .from("projects")
    .groupBy("BusinessName");
  const countryList = knex
    .select("CountryName")
    .from("projects")
    .groupBy("CountryName");
  const townList = knex.select("Town").from("projects").groupBy("Town");
  const stateList = knex.select("State").from("projects").groupBy("State");

  const staffList = knex.select("StaffID").from("staffMeta");
  const jobTitles = knex
    .select("JobTitle")
    .from("staffMeta")
    .groupBy("JobTitle");
  const locationList = knex
    .select("LocationName")
    .from("staffMeta")
    .groupBy("LocationName");
  const disciplineNames = knex
    .select("DisciplineName")
    .from("staffMeta")
    .groupBy("DisciplineName");
  const gradeLevels = knex
    .select("GradeLevel")
    .from("staffMeta")
    .groupBy("GradeLevel");

  return Promise.all([
    projectList,
    clientList,
    costCentreList,
    businessNameList,
    countryList,
    townList,
    stateList,
    staffList,
    jobTitles,
    locationList,
    disciplineNames,
    gradeLevels,
  ]).then((promiseArr) => {
    const dbInfo = {};

    promiseArr.forEach((query) => {
      const queryName = Object.keys(query[0])[0];
      const queryArray = query.map((item) => {
        return item[queryName];
      });
      dbInfo[queryName] = queryArray.sort();
    });

    return dbInfo;
  });
};
