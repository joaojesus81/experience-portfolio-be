exports.formatProjects = (list) => {
  function createDate(str1) {
    // str1 format should be dd/mm/yyyy.
    const dt1 = parseInt(str1.substring(0, 2));
    const mon1 = parseInt(str1.substring(3, 5));
    const yr1 = parseInt(str1.substring(6, 10));
    const date1 = new Date(yr1, mon1 - 1, dt1, 12, 0, 0, 0);
    return date1;
  }

  const formattedArray = list.map(({ ...object }) => {
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
    return (
      projectcodes.includes(object.ProjectCode) &&
      staffnos.includes(object.StaffID)
    );
  });
  return filteredArray;
};
