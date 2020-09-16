const express = require("express");
const apiRouter = require("./routes/api.router");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const formData = require("express-form-data");

const {
  handlePSQLErrors,
  handleCustomErrors,
  handle404s,
  handle500s,
  handleCloudinaryErrors,
} = require("./errors");

require("dotenv").config();

const app = express();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.use(cors());

//Test whether we need the following or not:
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.use(express.json());
app.use(formData.parse());

app.use("/api", apiRouter);

app.all("*", handle404s);

app.use(handlePSQLErrors);
app.use(handleCloudinaryErrors);
app.use(handleCustomErrors);
app.use(handle500s);

module.exports = app;
