const fs = require("fs");
const docx = require("docx");
const fetch = require("node-fetch");

const {
  Document,
  Packer,
  Paragraph,
  Media,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
} = docx;

const { fetchProjectsByStaffID } = require("../models/projects.models");

const { fetchStaffMetaByID } = require("../models/staff.models");

const generateFromUrl = async (req, res, next) => {
  const { StaffID } = req.params;

  const projects = await fetchProjectsByStaffID(StaffID, { showDetails: true });
  const staffMeta = await fetchStaffMetaByID(StaffID);
  console.log(staffMeta, "staffMeta");

  const doc = new Document();

  const requestURL =
    "https://res.cloudinary.com/gfsimages/image/upload/v1600426601/expport/staffPics/IMG_0945.jpg";
  const response = await fetch(requestURL);
  console.log(response, "response");
  const data = await response.buffer();
  const b64 = data.toString("base64");

  const image1 = Media.addImage(doc, b64);

  const staffMetaKeys = Object.keys(staffMeta);

  const removeBorders = {
    top: { style: BorderStyle.NIL },
    bottom: { style: BorderStyle.NIL },
    left: { style: BorderStyle.NIL },
    right: { style: BorderStyle.NIL },
  };

  const staffMetaArray = [];

  staffMetaKeys.forEach((staffitem) => {
    if (
      staffitem !== "valueStatement" &&
      staffitem !== "highLevelDescription"
    ) {
      staffMetaArray.push(
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph(`${staffitem}: ${staffMeta[staffitem]}`),
              ],
              borders: removeBorders,
            }),
          ],
          borders: removeBorders,
        })
      );
    }
  });

  staffMetaArray.unshift(
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph(image1)],
          borders: removeBorders,
          alignment: AlignmentType.CENTER,
          alignment: "center",
          // children: [
          //   new Paragraph(image1, {
          //     options: { alignment: AlignmentType.CENTER },
          //   }),
          // ],
          // children: [
          //   new Paragraph({
          //     text: image1,
          //     alignment: AlignmentType.CENTER,
          //   }),
          // ],
        }),
      ],
      borders: removeBorders,
      alignment: AlignmentType.CENTER,
      alignment: "center",
    })
  );

  const highLevelDescriptionRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            text: `${staffMeta.highLevelDescription}`,
          }),
        ],
        borders: removeBorders,
      }),
    ],
    borders: removeBorders,
  });

  const valueStatementRow = new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            text: `${staffMeta.valueStatement}`,
          }),
        ],
        borders: removeBorders,
      }),
    ],
    borders: removeBorders,
  });

  const projectsTableEntries = projects.map((project) => {
    return new TableRow({
      children: [
        new TableCell({
          children: [
            new Paragraph({
              text: `${project.JobNameLong} (${project.ClientName})`,
              alignment: AlignmentType.LEFT,
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph(`${project.ScopeOfWorks}`),
            new Paragraph(`${project.experience}`),
          ],
          borders: removeBorders,
        }),
      ],
      borders: removeBorders,
    });
  });

  projectsTableEntries.unshift(valueStatementRow);
  projectsTableEntries.unshift(highLevelDescriptionRow);

  const staffMetaTable = new Table({
    rows: staffMetaArray,
    // float: {
    //   horizontalAnchor: TableAnchorType.MARGIN,
    //   verticalAnchor: TableAnchorType.MARGIN,
    //   relativeHorizontalPosition: RelativeHorizontalPosition.RIGHT,
    //   relativeVerticalPosition: RelativeVerticalPosition.BOTTOM,
    //   overlap: OverlapType.NEVER,
    // },
    width: {
      size: "90%",
      type: WidthType.pct,
    },
    layout: TableLayoutType.FIXED,
    alignment: AlignmentType.CENTER,
    borders: removeBorders,
  });

  console.log("past the table now");

  const projectsTable = new Table({
    rows: projectsTableEntries,
    width: {
      size: "95%",
      type: WidthType.pct,
    },
    alignment: "center",
    layout: TableLayoutType.FIXED,
    borders: removeBorders,
  });

  const containerTable = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                text: "Sam Styles",
                alignment: AlignmentType.LEFT,
                heading: HeadingLevel.HEADING_1,
              }),
            ],
            columnSpan: 2,
            borders: removeBorders,
          }),
        ],
        borders: removeBorders,
      }),

      new TableRow({
        children: [
          new TableCell({
            children: [staffMetaTable],
            width: {
              size: "25%",
              type: WidthType.pct,
            },
            alignment: AlignmentType.CENTER,
            borders: removeBorders,
          }),
          new TableCell({
            children: [projectsTable],
            width: {
              size: "75%",
              type: WidthType.pct,
            },
            alignment: AlignmentType.CENTER,
            borders: removeBorders,
          }),
        ],
        borders: removeBorders,
      }),
    ],
    // float: {
    //   horizontalAnchor: TableAnchorType.MARGIN,
    //   verticalAnchor: TableAnchorType.MARGIN,
    //   relativeHorizontalPosition: RelativeHorizontalPosition.RIGHT,
    //   relativeVerticalPosition: RelativeVerticalPosition.BOTTOM,
    //   overlap: OverlapType.NEVER,
    // },
    alignment: "center",
    width: {
      size: 9000,
      type: WidthType.DXA,
    },
    layout: TableLayoutType.FIXED,
    borders: removeBorders,
  });

  doc.addSection({
    children: [containerTable],
    borders: removeBorders,
  });
  console.log("before packer");

  Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(`${StaffID}.docx`, buffer);
  });

  res.status(201).send("Done!");
};

module.exports = { generateFromUrl };
