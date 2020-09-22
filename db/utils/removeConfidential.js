const fs = require("fs");

const projectsProd = require("../data/prod/projects.json");
const staffExperienceProd = require("../data/prod/staffExperience.json");

const confidentialProjects = projectsProd.filter((project) => {
  return (
    /confidential/i.test(project.ScopeOfWorks) ||
    /confidential/i.test(project.JobNameLong)
  );
});

const confidentialCodes = confidentialProjects.map((project) => {
  return project.ProjectCode;
});

const filteredProjects = projectsProd.filter((project) => {
  return (
    !/confidential/i.test(project.ScopeOfWorks) &&
    !/confidential/i.test(project.JobNameLong)
  );
});

const filteredExperience = staffExperienceProd.filter((experience) => {
  return !confidentialCodes.includes(experience.ProjectCode);
});

const confidentialExperience = staffExperienceProd.filter((experience) => {
  return confidentialCodes.includes(experience.ProjectCode);
});

fs.writeFile(
  "./db/data/prod/projects.json",
  JSON.stringify(filteredProjects),
  "utf8",
  (err) => {
    if (err) throw err;
  }
);

fs.writeFile(
  "./db/data/prod/staffExperience.json",
  JSON.stringify(filteredExperience),
  "utf8",
  (err) => {
    if (err) throw err;
  }
);
