//https://github.com/dolanmiu/docx/blob/master/demo/20-table-cell-borders.ts

const fs = require("fs");
const docx = require("docx");

const {
  BorderStyle,
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
} = docx;

const doc = new Document();

const table = new Table({
  rows: [
    new TableRow({
      children: [
        new TableCell({
          children: [],
        }),
        new TableCell({
          children: [],
        }),
        new TableCell({
          children: [],
        }),
        new TableCell({
          children: [],
        }),
      ],
    }),
    new TableRow({
      children: [
        new TableCell({
          children: [],
        }),
        new TableCell({
          children: [new Paragraph("Hello tutorial 20 again")],
          borders: {
            top: {
              style: BorderStyle.DASH_DOT_STROKED,
              size: 3,
              color: "red",
            },
            bottom: {
              style: BorderStyle.DOUBLE,
              size: 3,
              color: "blue",
            },
            left: {
              style: BorderStyle.DASH_DOT_STROKED,
              size: 3,
              color: "green",
            },
            right: {
              style: BorderStyle.DASH_DOT_STROKED,
              size: 3,
              color: "#ff8000",
            },
          },
        }),
        new TableCell({
          children: [],
        }),
        new TableCell({
          children: [],
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
        new TableCell({
          children: [],
        }),
        new TableCell({
          children: [],
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
        new TableCell({
          children: [],
        }),
        new TableCell({
          children: [],
        }),
      ],
    }),
  ],
});

doc.addSection({ children: [table] });

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("Tutorial20.docx", buffer);
});
