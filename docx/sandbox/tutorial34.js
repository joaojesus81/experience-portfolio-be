// Example of how you would create a table with float positions

//github.com/dolanmiu/docx/blob/master/demo/34-floating-tables.ts

const fs = require("fs");
const docx = require("docx");

const {
  Document,
  OverlapType,
  Packer,
  Paragraph,
  RelativeHorizontalPosition,
  RelativeVerticalPosition,
  Table,
  TableAnchorType,
  TableCell,
  TableLayoutType,
  TableRow,
  WidthType,
} = docx;

const doc = new Document();

const table = new Table({
  rows: [
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph("Hello again")],
          columnSpan: 2,
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [],
        }),
        new TableCell({
          children: [],
        }),
      ],
    }),
  ],
  float: {
    horizontalAnchor: TableAnchorType.MARGIN,
    verticalAnchor: TableAnchorType.MARGIN,
    relativeHorizontalPosition: RelativeHorizontalPosition.RIGHT,
    relativeVerticalPosition: RelativeVerticalPosition.BOTTOM,
    overlap: OverlapType.NEVER,
  },
  width: {
    size: 4535,
    type: WidthType.DXA,
  },
  layout: TableLayoutType.FIXED,
});

doc.addSection({
  children: [table],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("Tutorial34.docx", buffer);
});
