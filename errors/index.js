exports.handle405s = (req, res, next) => {
  res.status(405).send({ msg: "method not allowed!!!" });
};

exports.handle404s = (req, res, next) => {
  res.status(404).send({ msg: "Path not found! :-(" });
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (
    err.code === "42703" || //undefined column
    err.code === "23502" || //not null violation
    err.code === "22P02" // invalid text representation
  ) {
    res.status(400).send({ msg: "bad request to db!!!" });
  } else if (err.code === "23503") {
    //foreign key violation - 422
    res.status(422).send({ msg: "request could not be processed in db!!!" });
  } else next(err);
};

exports.handleCloudinaryErrors = (err, req, res, next) => {
  if (err.name === "Error") {
    res.status(err.http_code).send({ msg: err.message });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  console.log("in custom errors");
  // console.log(err);

  // if (err.code === "ERR_HTTP_INVALID_STATUS_CODE") {
  //   res.status(400).send({ msg: "no files sent" });
  // } else
  if ("status" in err) {
    {
      res.status(err.status).send({ msg: err.msg });
    }
  } else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log(err, "console logged in errors/index.js/handle500s");
  res.status(500).send({ msg: "server error!!!" });
};
