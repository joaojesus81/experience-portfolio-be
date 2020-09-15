const express = require("express");
const apiRouter = require("./routes/api.router");
// const cors = require("cors");

const {
  handlePSQLErrors,
  handleCustomErrors,
  handle404s,
  handle500s,
} = require("./errors");

const app = express();

// app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", handle404s);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;
