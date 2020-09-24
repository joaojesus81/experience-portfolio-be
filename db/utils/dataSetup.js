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
  //StaffID: [59754, 37704, 56876, 68169, 20126, 48615, 56554, 26872],
  // StaffID: [
  //   79522,
  //   79269,
  //   79164,
  //   78610,
  //   78495,
  //   77787,
  //   77716,
  //   77561,
  //   77435,
  //   77383,
  //   77190,
  //   77151,
  //   77055,
  //   76774,
  //   76723,
  //   76692,
  //   76306,
  //   76296,
  //   76144,
  //   76131,
  //   76121,
  //   76120,
  //   75824,
  //   75730,
  //   75724,
  //   75722,
  //   75720,
  //   75717,
  //   75444,
  //   75307,
  //   75176,
  //   75128,
  //   75092,
  //   74937,
  //   74905,
  //   74690,
  //   74630,
  //   74541,
  //   74474,
  //   74199,
  //   73882,
  //   73497,
  //   73324,
  //   73268,
  //   73158,
  //   72857,
  //   72620,
  //   72438,
  //   72411,
  //   72403,
  //   72318,
  //   72154,
  //   72096,
  //   71923,
  //   71900,
  //   71821,
  //   71598,
  //   71439,
  //   71337,
  //   71318,
  //   71112,
  //   71050,
  //   70852,
  //   70710,
  //   69840,
  //   69650,
  //   69647,
  //   69249,
  //   69222,
  //   69216,
  //   69214,
  //   68999,
  //   68887,
  //   68620,
  //   68553,
  //   68540,
  //   68535,
  //   68492,
  //   68317,
  //   68261,
  //   68197,
  //   68179,
  //   68169,
  //   68162,
  //   68006,
  //   67915,
  //   67898,
  //   67829,
  //   67700,
  //   67650,
  //   67614,
  //   67461,
  //   67434,
  //   67264,
  //   66713,
  //   66413,
  //   65945,
  //   64776,
  //   64771,
  //   64650,
  //   64473,
  //   64442,
  //   64410,
  //   64355,
  //   64332,
  //   64284,
  //   64083,
  //   64065,
  //   64045,
  //   64017,
  //   63975,
  //   63972,
  //   63951,
  //   63930,
  //   63928,
  //   63926,
  //   63842,
  //   63786,
  //   63635,
  //   63621,
  //   63492,
  //   63122,
  //   62997,
  //   62942,
  //   62941,
  //   62308,
  //   62206,
  //   62107,
  //   62085,
  //   61783,
  //   61446,
  //   61408,
  //   61110,
  //   60825,
  //   60818,
  //   60786,
  //   60778,
  //   60735,
  //   60710,
  //   60680,
  //   60466,
  //   60463,
  //   60428,
  //   59794,
  //   59792,
  //   59754,
  //   59431,
  //   59312,
  //   58842,
  //   58700,
  //   58597,
  //   58567,
  //   58317,
  //   58284,
  //   57590,
  //   57493,
  //   57438,
  //   57420,
  //   57296,
  //   57228,
  //   57223,
  //   57185,
  //   57159,
  //   57122,
  //   56974,
  //   56924,
  //   56876,
  //   56815,
  //   56788,
  //   56786,
  //   56749,
  //   56724,
  //   56705,
  //   56653,
  //   56626,
  //   56625,
  //   56606,
  //   56564,
  //   56554,
  //   56206,
  //   56189,
  //   56048,
  //   55744,
  //   55340,
  //   55140,
  //   54924,
  //   54847,
  //   54563,
  //   54553,
  //   54415,
  //   54175,
  //   54084,
  //   53786,
  //   53693,
  //   53662,
  //   53397,
  //   53381,
  //   53217,
  //   52979,
  // ],
  StaffID: [
    79522,
    79269,
    79164,
    78610,
    78495,
    77787,
    77716,
    77561,
    77435,
    77383,
    77190,
    77151,
    77055,
    76774,
    76723,
    76692,
    76306,
    76296,
    76144,
    76131,
    76121,
    76120,
    75824,
    75730,
    75724,
    75722,
    75720,
    75717,
    75444,
    75307,
    75176,
    75128,
    75092,
    74937,
    74905,
    74690,
    74630,
    74541,
    74474,
    74199,
    73882,
    73497,
    73324,
    73268,
    73158,
    72857,
    72620,
    72438,
    72411,
    72403,
    72318,
    72154,
    72096,
    71923,
    71900,
    71821,
    71598,
    71439,
    71337,
    71318,
    71112,
    71050,
    70852,
    70710,
    69840,
    69650,
    69647,
    69249,
    69222,
    69216,
    69214,
    68999,
    68887,
    68620,
    68553,
    68540,
    68535,
    68492,
    68317,
    68261,
    68197,
    68179,
    68169,
    68162,
    68006,
    67915,
    67898,
    67829,
    67700,
    67650,
    67614,
    67461,
    67434,
    67264,
    66713,
    66413,
    65945,
    64776,
    64771,
    64650,
    64473,
    64442,
    64410,
    64355,
    64332,
    64284,
    64083,
    64065,
    64045,
    64017,
    63975,
    63972,
    63951,
    63930,
    63928,
    63926,
    63842,
    63786,
    63635,
    63621,
    63492,
    63122,
    62997,
    62942,
    62941,
    62308,
    62206,
    62107,
    62085,
    61783,
    61446,
    61408,
    61110,
    60825,
    60818,
    60786,
    60778,
    60735,
    60710,
    60680,
    60466,
    60463,
    60428,
    59794,
    59792,
    59754,
    59431,
    59312,
    58842,
    58700,
    58597,
    58567,
    58317,
    58284,
    57590,
    57493,
    57438,
    57420,
    57296,
    57228,
    57223,
    57185,
    57159,
    57122,
    56974,
    56924,
    56876,
    56815,
    56788,
    56786,
    56749,
    56724,
    56705,
    56653,
    56626,
    56625,
    56606,
    56564,
    56554,
    56206,
    56189,
    56048,
    55744,
    55340,
    55140,
    54924,
    54847,
    54563,
    54553,
    54415,
    54175,
    54084,
    53786,
    53693,
    53662,
    53397,
    53381,
    53217,
    52979,
    52882,
    52866,
    52857,
    52825,
    52727,
    52724,
    52721,
    52339,
    52266,
    52213,
    52115,
    52074,
    51594,
    51567,
    51451,
    51400,
    51101,
    50902,
    50880,
    50836,
    50735,
    50631,
    50560,
    48972,
    48818,
    48759,
    48739,
    48716,
    48666,
    48615,
    48614,
    48541,
    48384,
    48153,
    48115,
    47052,
    42168,
    41607,
    41588,
    40508,
    40319,
    39161,
    39025,
    38090,
    37767,
    37709,
    37704,
    37702,
    37668,
    37155,
    36933,
    36246,
    34750,
    34693,
    34574,
    34546,
    34072,
    34070,
    33325,
    33275,
    32790,
    32503,
    32371,
    31651,
    31509,
    31352,
    31296,
    31184,
    30748,
    30039,
    29952,
    29888,
    29806,
    29681,
    28833,
    28156,
    28024,
    27186,
    26872,
    26403,
    25750,
    25553,
    25542,
    24253,
    24217,
    24081,
    23885,
    23659,
    23264,
    21643,
    21200,
    20660,
    20126,
    20072,
    18644,
    18266,
    18095,
    17049,
    16249,
    15722,
    15656,
    15655,
    14857,
    13965,
    13755,
    11593,
    10377,
    9949,
    8408,
    7406,
    6517,
    6455,
    5244,
    4646,
    3464,
    2888,
    2592,
  ],
};
const testStaffFilter = { StaffID: [59754, 37704, 56876] };

// %%%%%%%%%%% Dev data %%%%%%%%%%%%

const devStaff = filterObject(staffProd, devStaffFilter);
const devStaffExperiencePrelim = filterObject(
  staffExperienceProd,
  devStaffFilter
);

// console.log(devStaffExperience, "devStaffExperience");
//Retrieve only projects and project keywords associated with the staff's projects
const devProjectsArray = devStaffExperiencePrelim.map((staffexperience) => {
  return staffexperience.ProjectCode;
});
const devProjectsFilter = {
  ProjectCode: devProjectsArray,
};
// console.log(devProjectsFilter, "devProjectsFilter");
const devProjects = filterObject(projectsProd, devProjectsFilter);
// console.log(devProjects, "devProjects");

//Use the filtered list of projects to remove keywords and staff experience on "excluded" projects
const includedDevProjects = devProjects.map((project) => {
  return project.ProjectCode;
});
devProjectsFilter.ProjectCode = includedDevProjects;

const devKeywords = filterObject(keywordsProd, devProjectsFilter);
const devStaffExperience = filterObject(
  devStaffExperiencePrelim,
  devProjectsFilter
);

// console.log(devKeywords, "devKeywords");

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
const testStaffExperiencePrelim = filterObject(
  staffExperienceProd,
  testStaffFilter
);

const testProjectsArray = testStaffExperiencePrelim.map((staffexperience) => {
  return staffexperience.ProjectCode;
});
const testProjectsFilter = {
  ProjectCode: testProjectsArray,
};
const testProjects = filterObject(projectsProd, testProjectsFilter);

const includedTestProjects = testProjects.map((project) => {
  return project.ProjectCode;
});
testProjectsFilter.ProjectCode = includedTestProjects;

const testKeywords = filterObject(keywordsProd, testProjectsFilter);
const testStaffExperience = filterObject(
  testStaffExperiencePrelim,
  testProjectsFilter
);
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
  JSON.stringify(testkeywordList),
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
