// Make sure to load the environment variable first
require("./dotenv");

const express = require("express");
const bodyParser = require("body-parser");
const crossDomain = require("./middleware/cross-domain");
const userAgent = require("./middleware/user-agent");
const log = require("./middleware/log");
const routers = require("./routers");
const log4js = require("./log4js");

const logger = log4js.getLogger(process.env.LOG_CATEGORY);

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(express.static("./"));
}

app.use(bodyParser.json());

app.use(log);

app.use(userAgent);

app.use(crossDomain);

app.use(routers);

// Error handling
app.use(function (err, req, res, next) {
  logger.error(err.stack);
  res.status(500).send({
    code: "-1",
    msg: err.stack
  });
});
/* eslint-disable no-console */
app.listen(3011, () => {
  console.log("Your app is running");
});
