exports.formatProjects = (list, projectKeywordsData, keywordThesaurusData) => {
  function createDate(str1) {
    // str1 format should be dd/mm/yyyy.
    const dt1 = parseInt(str1.substring(0, 2));
    const mon1 = parseInt(str1.substring(3, 5));
    const yr1 = parseInt(str1.substring(6, 10));
    const date1 = new Date(yr1, mon1 - 1, dt1, 12, 0, 0, 0);
    return date1;
  }

  //&&&
  function filterProjectKeywords(ProjectCode, projectKeywordsData) {
    const filteredArray = projectKeywordsData.filter((keyword) => {
      return keyword.ProjectCode === ProjectCode;
    });

    const codeArray = filteredArray.map((item) => {
      return item.KeywordCode;
    });

    const relatedArray = findRelatedKeywords(codeArray, keywordThesaurusData);

    return relatedArray;
  }

  function findRelatedKeywords(codeArray, keywordThesaurusData) {
    const relatedArray = [...codeArray];
    codeArray.forEach((keyword) => {
      const relatedRows = keywordThesaurusData.filter((row) => {
        return row.KeywordCode === keyword;
      });

      const relatedWords = relatedRows.map((row) => {
        return row.RelatedKeywordCode;
      });

      relatedWords.forEach((keyword) => {
        if (!relatedArray.includes(keyword)) relatedArray.push(keyword);
      });
    });

    relatedArray.sort();
    return relatedArray;
  }

  const formattedArray = list.map(({ ...object }) => {
    const projectKeywords = filterProjectKeywords(
      object.ProjectCode,
      projectKeywordsData,
      keywordThesaurusData
    );

    const StartDate = createDate(object.StartDate);
    const EndDate = createDate(object.EndDate);
    object.StartDate = StartDate;
    object.EndDate = EndDate;
    if (object.AccountingCentreCode === "") object.AccountingCentreCode = null;
    if (object.ProjectDirectorID === "") object.ProjectDirectorID = null;
    if (object.ProjectManagerID === "") object.ProjectManagerID = null;
    if (object.Latitude === "") object.Latitude = null;
    if (object.Longitude === "") object.Longitude = null;
    if (object.PercentComplete === "") object.PercentComplete = null;
    if (object.ClientID === "") object.ClientID = null;
    if (object.Confidential === "") object.Confidential = null;
    if (
      /confidential/i.test(object.ScopeOfWorks) ||
      /confidential/i.test(object.JobNameLong)
    ) {
      object.Confidential = true;
    }
    object.ScopeOfWorks = [object.ScopeOfWorks];
    object.imgURL = [];
    object.Keywords = projectKeywords;

    return object;
  });

  return formattedArray;
};

exports.formatStaffExperience = (list) => {
  const filteredArray = list.filter(({ ...object }) => {
    return typeof object.ProjectCode !== "string";
  });
  return filteredArray;
};

exports.filterStaffTime = (experience, staffnos, projectcodes) => {
  const filteredArray = experience.filter(({ ...object }) => {
    //if (!staffnos.includes(object.StaffID)) console.log(object.StaffID);

    return (
      projectcodes.includes(object.ProjectCode) &&
      staffnos.includes(object.StaffID)
    );
  });
  return filteredArray;
};

exports.formatKeywords = (list) => {
  const formattedArray = list.map(({ ...object }) => {
    object.KeywordGroupCode = object.KeywordCode.slice(0, 2);
    return object;
  });
  return formattedArray;
};

exports.formatStaffMeta = (list) => {
  const formattedArray = list.map(({ ...object }) => {
    object.qualifications = [];
    object.professionalAssociations = [];
    object.committees = [];
    object.publications = [];
    object.careerStart = object.StartDate;
    return object;
  });
  return formattedArray;
};
