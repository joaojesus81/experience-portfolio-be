const {
  formatProjects,
  filterStaffTime,
} = require("../db/utils/dataFormatting.js");

const projectInput = [
  {
    ProjectCode: 22398800,
    JobNameLong: "WARRINGTON TOWN CENTRE REDEVELOPMENT",
    StartDate: "23/03/2012",
    EndDate: "30/08/2020",
    CentreName: "Buildings NW & Yorkshire",
    AccountingCentreCode: "01419",
    PracticeName: "Building Engineering",
    BusinessCode: "BC03",
    BusinessName: "Property",
    ProjectDirectorID: 29952,
    ProjectDirectorName: "Matthew Holden",
    ProjectManagerID: 37704,
    ProjectManagerName: "Samuel Styles",
    CountryName: "England",
    Town: "Warrington",
    ScopeOfService:
      "Multi-disciplinary appointment, initially in support of bid, then project delivery if Muse are successful.",
    ScopeOfWorks:
      "Mixed use development in central Warrington, for the Bridge Street Quarter.",
    Latitude: 53.39,
    Longitude: -2.596944,
    State: "CHESHIRE",
    PercentComplete: 100,
    ClientID: 11276,
    ClientName: "Muse Developments Ltd",
    ProjectURL:
      "http://projects.intranet.arup.com/?layout=projects.proj.view&jp=OA&jn=22398800",
    Confidential: 0,
  },
];

const brokenProjectInput = [
  {
    ProjectCode: 22398800,
    JobNameLong: "WARRINGTON TOWN CENTRE REDEVELOPMENT",
    StartDate: "23/03/2012",
    EndDate: "30/08/2020",
    CentreName: "Buildings NW & Yorkshire",
    AccountingCentreCode: "01419",
    PracticeName: "Building Engineering",
    BusinessCode: "BC03",
    BusinessName: "Property",
    ProjectDirectorID: "",
    ProjectDirectorName: "Matthew Holden",
    ProjectManagerID: 37704,
    ProjectManagerName: "Samuel Styles",
    CountryName: "England",
    Town: "Warrington",
    ScopeOfService:
      "Multi-disciplinary appointment, initially in support of bid, then project delivery if Muse are successful.",
    ScopeOfWorks:
      "Mixed use development in central Warrington, for the Bridge Street Quarter.",
    Latitude: 53.39,
    Longitude: -2.596944,
    State: "CHESHIRE",
    PercentComplete: "",
    ClientID: 11276,
    ClientName: "Muse Developments Ltd",
    ProjectURL:
      "http://projects.intranet.arup.com/?layout=projects.proj.view&jp=OA&jn=22398800",
    Confidential: "",
  },
];

const longProjectInput = [
  {
    ProjectCode: 22398800,
    JobNameLong: "WARRINGTON TOWN CENTRE REDEVELOPMENT",
    StartDate: "23/03/2012",
    EndDate: "30/08/2020",
    CentreName: "Buildings NW & Yorkshire",
    AccountingCentreCode: "01419",
    PracticeName: "Building Engineering",
    BusinessCode: "BC03",
    BusinessName: "Property",
    ProjectDirectorID: 29952,
    ProjectDirectorName: "Matthew Holden",
    ProjectManagerID: 37704,
    ProjectManagerName: "Samuel Styles",
    CountryName: "England",
    Town: "Warrington",
    ScopeOfService:
      "Multi-disciplinary appointment, initially in support of bid, then project delivery if Muse are successful.",
    ScopeOfWorks:
      "Mixed use development in central Warrington, for the Bridge Street Quarter.",
    Latitude: 53.39,
    Longitude: -2.596944,
    State: "CHESHIRE",
    PercentComplete: 100,
    ClientID: 11276,
    ClientName: "Muse Developments Ltd",
    ProjectURL:
      "http://projects.intranet.arup.com/?layout=projects.proj.view&jp=OA&jn=22398800",
    Confidential: 0,
  },
  {
    ProjectCode: 22536300,
    JobNameLong: "COPENHAGEN ARENA",
    StartDate: "20/06/2012",
    EndDate: "11/03/2020",
    CentreName: "Buildings NW & Yorkshire",
    AccountingCentreCode: "01419",
    PracticeName: "Building Engineering",
    BusinessCode: "BC01",
    BusinessName: "Arts & Culture",
    ProjectDirectorID: 29952,
    ProjectDirectorName: "Matthew Holden",
    ProjectManagerID: 29952,
    ProjectManagerName: "Matthew Holden",
    CountryName: "Denmark",
    Town: "Copenhagen",
    ScopeOfService:
      "Engineering design including civil, structural, geotechnical, fire, facade engineering, plus acoustics, specialist lighting and sustainability consultancy. \n\nOur design for Copenhagen Arena was developed through Feasibility, Concept, Scheme and Detailed Design, providing a full set of Tender and then Construction information and as-built records. This documentation included drawings, reports and detailed specifications. All of the documentation was developed specifically to reflect the requirements of the supply chain, the third party checking team and the approving authorities. This facilitated smooth delivery and approval.",
    ScopeOfWorks:
      "Arena for concerts and sport, with a seated capacity of 12,500 people and a maximum capacity of 15,000. Situated in Orestad, between Copenhagen City Centre and Kastrup Airport.",
    Latitude: 55.625278,
    Longitude: 12.573611,
    State: "",
    PercentComplete: 100,
    ClientID: 79557,
    ClientName: "3XN A/S",
    ProjectURL:
      "http://projects.intranet.arup.com/?layout=projects.proj.view&jp=OA&jn=22536300",
    Confidential: 0,
  },
];
const projectKeywordsInput = [
  { ProjectCode: 22398800, KeywordCode: "CT0010" },
  { ProjectCode: 22398800, KeywordCode: "BC0004" },
  { ProjectCode: 22398800, KeywordCode: "AP0054" },
];
const keywordThesaurusData = [
  { KeywordCode: "AP0054", RelatedKeywordCode: "AP9900" },
  { KeywordCode: "BC0004", RelatedKeywordCode: "BC0001" },
  { KeywordCode: "BC0004", RelatedKeywordCode: "MS0022" },
  { KeywordCode: "AP0005", RelatedKeywordCode: "DI9900" },
  { KeywordCode: "AP0050", RelatedKeywordCode: "DI0001" },
];

describe("formatProjects", () => {
  test("Returns a new array", () => {
    const input = [];
    const output = formatProjects(
      projectInput,
      projectKeywordsInput,
      keywordThesaurusData
    );
    expect(Array.isArray(output)).toBe(true);
    expect(output).not.toBe(input);
  });
  test("Returns new objects within array", () => {
    const output = formatProjects(
      projectInput,
      projectKeywordsInput,
      keywordThesaurusData
    );
    expect(output[0]).not.toBe(projectInput[0]);
  });
  test("Returns a date instance", () => {
    const output = formatProjects(
      projectInput,
      projectKeywordsInput,
      keywordThesaurusData
    );
    expect(output[0].StartDate).toBeInstanceOf(Date);
    expect(output[0].EndDate).toBeInstanceOf(Date);
  });
  test("Converts empty string to null for integers/decimals", () => {
    const output = formatProjects(
      brokenProjectInput,
      projectKeywordsInput,
      keywordThesaurusData
    );
    expect(output[0].ProjectDirectorID).toBe(null);
    expect(output[0].PercentComplete).toBe(null);
    expect(output[0].Confidential).toBe(null);
  });
  test("Works with multiple entries ", () => {
    const output = formatProjects(
      longProjectInput,
      projectKeywordsInput,
      keywordThesaurusData
    );
    expect(output[0].JobNameLong).toEqual(longProjectInput[0].JobNameLong);
    expect(output[0].ProjectCode).toEqual(longProjectInput[0].ProjectCode);
    expect(output[0].StartDate).toBeInstanceOf(Date);
    expect(output[0].EndDate).toBeInstanceOf(Date);
    expect(output[1].JobNameLong).toEqual(longProjectInput[1].JobNameLong);
    expect(output[1].ProjectCode).toEqual(longProjectInput[1].ProjectCode);
    expect(output[1].StartDate).toBeInstanceOf(Date);
    expect(output[1].EndDate).toBeInstanceOf(Date);
  });
  test("Returns correct object including keywords and related keywords", () => {
    const output = formatProjects(
      projectInput,
      projectKeywordsInput,
      keywordThesaurusData
    );
    expect(output).toEqual([
      {
        ProjectCode: 22398800,
        JobNameLong: "WARRINGTON TOWN CENTRE REDEVELOPMENT",
        StartDate: expect.any(Date),
        EndDate: expect.any(Date),
        CentreName: "Buildings NW & Yorkshire",
        AccountingCentreCode: "01419",
        PracticeName: "Building Engineering",
        BusinessCode: "BC03",
        BusinessName: "Property",
        ProjectDirectorID: 29952,
        ProjectDirectorName: "Matthew Holden",
        ProjectManagerID: 37704,
        ProjectManagerName: "Samuel Styles",
        CountryName: "England",
        Town: "Warrington",
        ScopeOfService:
          "Multi-disciplinary appointment, initially in support of bid, then project delivery if Muse are successful.",
        ScopeOfWorks: [
          "Mixed use development in central Warrington, for the Bridge Street Quarter.",
        ],
        Latitude: 53.39,
        Longitude: -2.596944,
        State: "CHESHIRE",
        PercentComplete: 100,
        ClientID: 11276,
        ClientName: "Muse Developments Ltd",
        ProjectURL:
          "http://projects.intranet.arup.com/?layout=projects.proj.view&jp=OA&jn=22398800",
        Confidential: 0,
        imgURL: [],
        Keywords: ["AP0054", "AP9900", "BC0001", "BC0004", "CT0010", "MS0022"],
      },
    ]);
  });
  test("Does not mutate original", () => {
    formatProjects(projectInput, projectKeywordsInput, keywordThesaurusData);
    expect(projectInput).toEqual([
      {
        ProjectCode: 22398800,
        JobNameLong: "WARRINGTON TOWN CENTRE REDEVELOPMENT",
        StartDate: "23/03/2012",
        EndDate: "30/08/2020",
        CentreName: "Buildings NW & Yorkshire",
        AccountingCentreCode: "01419",
        PracticeName: "Building Engineering",
        BusinessCode: "BC03",
        BusinessName: "Property",
        ProjectDirectorID: 29952,
        ProjectDirectorName: "Matthew Holden",
        ProjectManagerID: 37704,
        ProjectManagerName: "Samuel Styles",
        CountryName: "England",
        Town: "Warrington",
        ScopeOfService:
          "Multi-disciplinary appointment, initially in support of bid, then project delivery if Muse are successful.",
        ScopeOfWorks:
          "Mixed use development in central Warrington, for the Bridge Street Quarter.",
        Latitude: 53.39,
        Longitude: -2.596944,
        State: "CHESHIRE",
        PercentComplete: 100,
        ClientID: 11276,
        ClientName: "Muse Developments Ltd",
        ProjectURL:
          "http://projects.intranet.arup.com/?layout=projects.proj.view&jp=OA&jn=22398800",
        Confidential: 0,
      },
    ]);
  });
});

describe("filterStaffTime", () => {
  test("Returns a new array", () => {
    const input = [];
    const output = filterStaffTime(input);
    expect(Array.isArray(output)).toBe(true);
    expect(output).not.toBe(input);
  });
  test("Removes projects where staff id or project code aren't present", () => {
    const exampleExperience = [
      { ProjectCode: 23796600, StaffID: 59754, TotalHrs: 11.25 },
      { ProjectCode: 24675700, StaffID: 37704, TotalHrs: 8.75 },
      { ProjectCode: 24527100, StaffID: 56876, TotalHrs: 66.5 },
      { ProjectCode: 24675700, StaffID: 56876, TotalHrs: 1223.75 },
    ];
    const exampleStaffList = [59754, 56876];
    const exampleProjectList = [23796600, 24527100];
    const expectedOutput = [
      { ProjectCode: 23796600, StaffID: 59754, TotalHrs: 11.25 },
      { ProjectCode: 24527100, StaffID: 56876, TotalHrs: 66.5 },
    ];
    expect(
      filterStaffTime(exampleExperience, exampleStaffList, exampleProjectList)
    ).toEqual(expectedOutput);
  });
  test("Does not mutate original", () => {
    const exampleExperience = [
      { ProjectCode: 23796600, StaffID: 59754, TotalHrs: 11.25 },
      { ProjectCode: 24675700, StaffID: 37704, TotalHrs: 8.75 },
      { ProjectCode: 24527100, StaffID: 56876, TotalHrs: 66.5 },
      { ProjectCode: 24675700, StaffID: 56876, TotalHrs: 1223.75 },
    ];
    const exampleStaffList = [59754, 56876];
    const exampleProjectList = [23796600, 24527100];
    filterStaffTime(exampleExperience, exampleStaffList, exampleProjectList);
    expect(exampleExperience).toEqual([
      { ProjectCode: 23796600, StaffID: 59754, TotalHrs: 11.25 },
      { ProjectCode: 24675700, StaffID: 37704, TotalHrs: 8.75 },
      { ProjectCode: 24527100, StaffID: 56876, TotalHrs: 66.5 },
      { ProjectCode: 24675700, StaffID: 56876, TotalHrs: 1223.75 },
    ]);
    expect(exampleStaffList).toEqual([59754, 56876]);
    expect(exampleProjectList).toEqual([23796600, 24527100]);
  });
});
