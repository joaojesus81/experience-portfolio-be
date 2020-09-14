exports.formatProjects = (list) => {
  function compareDate(str1) {
    // str1 format should be dd/mm/yyyy.
    var dt1 = parseInt(str1.substring(0, 2));
    var mon1 = parseInt(str1.substring(3, 5));
    var yr1 = parseInt(str1.substring(6, 10));
    var date1 = new Date(yr1, mon1 - 1, dt1);
    return date1;
  }

  const formattedArray = list.map(({ ...object }) => {
    object.StartDate = new Date(compareDate(object.StartDate));
    object.EndDate = new Date(compareDate(object.EndDate));
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
