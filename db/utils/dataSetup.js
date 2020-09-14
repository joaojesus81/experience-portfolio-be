const staffProd = require("../data/prod/staffMeta.json");
const staffExperienceProd = require("../data/prod/staffExperience.json");
const keywordsProd = require("../data/prod/projectKeywords.json");
const projectsProd = require("../data/prod/projects.json");
const keywordsThesaurusProd = require("../data/prod/keywordThesaurus.json");
const keywordGroups = require("../data/prod/keywordGroups.json");
const keywordList = require("../data/prod/keywordList.json");
const fs = require("fs");

function filterObject(jsonList, filterObject) {
  const filterBy = Object.keys(filterObject);
  const filter = filterBy[0];

  const filteredList = jsonList.filter((item) => {
    let match = false;
    filterObject[filter].forEach((check) => {
      if (item[filter] === check) match = true;
    });
    return match;
  });
  return filteredList;
}

//Filters
const devStaffFilter = {
  StaffID: [59754, 37704, 56876, 68169, 20126, 48615, 56554, 26872],
};
const testStaffFilter = { StaffID: [59754, 37704, 56876] };

// %%%%%%%%%%% Dev data %%%%%%%%%%%%

const devStaff = filterObject(staffProd, devStaffFilter);
const devStaffExperience = filterObject(staffExperienceProd, devStaffFilter);

//Retrieve only projects and project keywords associated with the staff's projects
const devProjectsArray = devStaffExperience.map((staffexperience) => {
  return staffexperience.ProjectCode;
});
const devProjectsFilter = {
  ProjectCode: devProjectsArray,
};
const devKeywords = filterObject(keywordsProd, devProjectsFilter);
const devProjects = filterObject(projectsProd, devProjectsFilter);

// Retrieve a keyword thesaurus only associated with our filtered keywords
const devKeywordsArray = devKeywords.map((keyword) => {
  return keyword.KeywordCode;
});
const devKeywordsFilter = {
  KeywordCode: devKeywordsArray,
};

const devKeywordThesaurus = filterObject(
  keywordsThesaurusProd,
  devKeywordsFilter
);
//Leave the following unchanged, currently.  Groups is only a short list, and the keyword list needs to contain both the keywords, and the thesaurus keywords.  Could filter this.
const devkeywordGroups = keywordGroups;
const devkeywordList = keywordList;

// %%%%%%%%%%% Test data %%%%%%%%%%%%

const testStaff = filterObject(staffProd, testStaffFilter);
const testStaffExperience = filterObject(staffExperienceProd, testStaffFilter);

const testProjectsArray = testStaffExperience.map((staffexperience) => {
  return staffexperience.ProjectCode;
});
const testProjectsFilter = {
  ProjectCode: testProjectsArray,
};
const testKeywords = filterObject(keywordsProd, testProjectsFilter);
const testProjects = filterObject(projectsProd, testProjectsFilter);

// Retrieve a keyword thesaurus only associated with our filtered keywords
const testKeywordsArray = testKeywords.map((keyword) => {
  return keyword.KeywordCode;
});
const testKeywordsFilter = {
  KeywordCode: testKeywordsArray,
};

const testKeywordThesaurus = filterObject(
  keywordsThesaurusProd,
  testKeywordsFilter
);

//Leave the following unchanged, currently.  Groups is only a short list, and the keyword list needs to contain both the keywords, and the thesaurus keywords.  Could filter this.
const testkeywordGroups = keywordGroups;
const testkeywordList = keywordList;

console.log(
  `No of projects:                  ${projectsProd.length}  / ${devProjects.length}   / ${testProjects.length}`
);
console.log(
  `No of project keyword entries:   ${keywordsProd.length} / ${devKeywords.length} / ${testKeywords.length}`
);
console.log(
  `No of keyword thesaurus entries: ${keywordsThesaurusProd.length} / ${devKeywordThesaurus.length} / ${testKeywordThesaurus.length}`
);
console.log(
  `No of staff:                     ${staffProd.length}   / ${devStaff.length}    / ${testStaff.length}`
);
console.log(
  `No of staffExperience entries:   ${staffExperienceProd.length}  / ${devStaffExperience.length}  / ${testStaffExperience.length}`
);

//Writing test files
fs.writeFile(
  "./db/data/test/staffExperience.json",
  JSON.stringify(testStaffExperience),
  "utf8",
  (err) => {
    if (err) throw err;
  }
);
fs.writeFile(
  "./db/data/test/staffMeta.json",
  JSON.stringify(testStaff),
  "utf8",
  (err) => {
    if (err) throw err;
  }
);
fs.writeFile(
  "./db/data/test/projectKeywords.json",
  JSON.stringify(testKeywords),
  "utf8",
  (err) => {
    if (err) throw err;
  }
);
fs.writeFile(
  "./db/data/test/projects.json",
  JSON.stringify(testProjects),
  "utf8",
  (err) => {
    if (err) throw err;
  }
);

fs.writeFile(
  "./db/data/test/keywordThesaurus.json",
  JSON.stringify(testKeywordThesaurus),
  "utf8",
  (err) => {
    if (err) throw err;
  }
);

fs.writeFile(
  "./db/data/test/keywordGroups.json",
  JSON.stringify(testkeywordGroups),
  "utf8",
  (err) => {
    if (err) throw err;
  }
);

fs.writeFile(
  "./db/data/test/keywordList.json",
  JSON.stringify(devkeywordList),
  "utf8",
  (err) => {
    if (err) throw err;
  }
);

//Writing dev files

fs.writeFile(
  "./db/data/dev/staffExperience.json",
  JSON.stringify(devStaffExperience),
  "utf8",
  (err) => {
    if (err) throw err;
  }
);
fs.writeFile(
  "./db/data/dev/staffMeta.json",
  JSON.stringify(devStaff),
  "utf8",
  (err) => {
    if (err) throw err;
  }
);
fs.writeFile(
  "./db/data/dev/projectKeywords.json",
  JSON.stringify(devKeywords),
  "utf8",
  (err) => {
    if (err) throw err;
  }
);
fs.writeFile(
  "./db/data/dev/projects.json",
  JSON.stringify(devProjects),
  "utf8",
  (err) => {
    if (err) throw err;
  }
);

fs.writeFile(
  "./db/data/dev/keywordThesaurus.json",
  JSON.stringify(devKeywordThesaurus),
  "utf8",
  (err) => {
    if (err) throw err;
  }
);

fs.writeFile(
  "./db/data/dev/keywordGroups.json",
  JSON.stringify(devkeywordGroups),
  "utf8",
  (err) => {
    if (err) throw err;
  }
);

fs.writeFile(
  "./db/data/dev/keywordList.json",
  JSON.stringify(devkeywordList),
  "utf8",
  (err) => {
    if (err) throw err;
  }
);
