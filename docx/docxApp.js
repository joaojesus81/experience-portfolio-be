const docx = require("docx");
const fs = require("fs");

const {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun,
} = docx;

const { fetchProjectsByStaffID } = require("../models/projects.models");

const { fetchStaffMetaByID } = require("../models/staff.models");

class DocumentCreator {
  create([projects, staffMeta]) {
    console.log(projects);
    console.log(staffMeta);
    const document = new Document();

    document.addSection({
      children: [
        new Paragraph({
          text: staffMeta.StaffName,
          heading: HeadingLevel.TITLE,
        }),
        this.createContactInfo(
          staffMeta.LocationName,
          staffMeta.JobTitle,
          staffMeta.Email
        ),
        this.createHeading("Projects"),
        ...projects
          .map((project) => {
            const arr = [];
            arr.push(
              this.createInstitutionHeader(
                project.JobNameLong,
                `${project.StartDate.year} - ${project.EndDate.year}`
              )
            );
            arr.push(
              this.createRoleText(
                `${project.PracticeName} - ${project.BusinessName}`
              )
            );

            const bulletPoints = this.splitParagraphIntoBullets(
              project.ScopeOfWorks[0]
            );
            bulletPoints.forEach((bulletPoint) => {
              arr.push(this.createBullet(bulletPoint));
            });
            console.log(arr, "arr!");
            return arr;
          })
          .reduce((prev, curr) => prev.concat(curr), []),
        this.createHeading("Skills, Achievements and Interests"),
        this.createSubHeading("Skills"),
        this.createSubHeading("Achievements"),
        this.createSubHeading("Interests"),
        this.createInterests(
          "Programming, Technology, Music Production, Web Design, 3D Modelling, Dancing."
        ),
        this.createHeading("References"),
        new Paragraph(
          "Dr. Dean Mohamedally Director of Postgraduate Studies Department of Computer Science, University College London Malet Place, Bloomsbury, London WC1E d.mohamedally@ucl.ac.uk"
        ),
        new Paragraph("More references upon request"),
        new Paragraph({
          text:
            "This CV was generated in real-time based on my Linked-In profile from my personal website www.dolan.bio.",
          alignment: AlignmentType.CENTER,
        }),
      ],
    });

    return document;
  }

  createContactInfo(phoneNumber, profileUrl, email) {
    return new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun(
          `Mobile: ${phoneNumber} | LinkedIn: ${profileUrl} | Email: ${email}`
        ),
        new TextRun("Address: 58 Elm Avenue, Kent ME4 6ER, UK").break(),
      ],
    });
  }

  createHeading(text) {
    return new Paragraph({
      text: text,
      heading: HeadingLevel.HEADING_1,
      thematicBreak: true,
    });
  }

  createSubHeading(text) {
    return new Paragraph({
      text: text,
      heading: HeadingLevel.HEADING_2,
    });
  }

  createInstitutionHeader(institutionName, dateText) {
    return new Paragraph({
      tabStops: [
        {
          type: TabStopType.RIGHT,
          position: TabStopPosition.MAX,
        },
      ],
      children: [
        new TextRun({
          text: institutionName,
          bold: true,
        }),
        new TextRun({
          text: `\t${dateText}`,
          bold: true,
        }),
      ],
    });
  }

  createRoleText(roleText) {
    return new Paragraph({
      children: [
        new TextRun({
          text: roleText,
          italics: true,
        }),
      ],
    });
  }

  createBullet(text) {
    return new Paragraph({
      text: text,
      bullet: {
        level: 0,
      },
    });
  }

  // tslint:disable-next-line:no-any
  createSkillList(skills) {
    return new Paragraph({
      children: [
        new TextRun(skills.map((skill) => skill.name).join(", ") + "."),
      ],
    });
  }

  // tslint:disable-next-line:no-any
  createAchivementsList(achivements) {
    return achivements.map(
      (achievement) =>
        new Paragraph({
          text: achievement.name,
          bullet: {
            level: 0,
          },
        })
    );
  }

  createInterests(interests) {
    return new Paragraph({
      children: [new TextRun(interests)],
    });
  }

  splitParagraphIntoBullets(text) {
    return text.split("\n\n");
  }

  // tslint:disable-next-line:no-any
  createPositionDateText(startDate, endDate, isCurrent) {
    const startDateText =
      this.getMonthFromInt(startDate.month) + ". " + startDate.year;
    const endDateText = isCurrent
      ? "Present"
      : `${this.getMonthFromInt(endDate.month)}. ${endDate.year}`;

    return `${startDateText} - ${endDateText}`;
  }

  getMonthFromInt(value) {
    switch (value) {
      case 1:
        return "Jan";
      case 2:
        return "Feb";
      case 3:
        return "Mar";
      case 4:
        return "Apr";
      case 5:
        return "May";
      case 6:
        return "Jun";
      case 7:
        return "Jul";
      case 8:
        return "Aug";
      case 9:
        return "Sept";
      case 10:
        return "Oct";
      case 11:
        return "Nov";
      case 12:
        return "Dec";
      default:
        return "N/A";
    }
  }
}

const generateCV = (req, res, next) => {
  const { StaffID } = req.params;
  console.log(StaffID);

  const promiseArray = [
    fetchProjectsByStaffID(StaffID, { showDetails: true }),
    fetchStaffMetaByID(StaffID),
  ];

  return Promise.all(promiseArray).then((promiseArr) => {
    const projects = promiseArr[0];
    const staffMeta = promiseArr[1];

    const documentCreator = new DocumentCreator();
    const doc = documentCreator.create([projects, staffMeta]);

    // return Packer.toBase64String(doc).then((result) => {
    //   const b64string = result;

    //console.log(b64string);

    // fs.writeFileS("37704.docx", b64string, { encoding: "base64" }, function (
    //   err,
    //   data
    // ) {
    //   if (err) {
    //     console.log("err", err);
    //   }
    //   console.log("success");
    // });

    return Packer.toBuffer(doc).then((buffer) => {
      fs.writeFileSync(`${staffMeta.StaffName}.docx`, buffer);
    });

    // res.setHeader(
    //   "Content-Disposition",
    //   "attachment; filename=My Document.docx"
    // );
    // res.send(Buffer.from(b64string, "base64"));
    // });
  });
};

module.exports = { generateCV };
