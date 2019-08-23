const path = require("path");
const log4js = require("log4js");

log4js.configure(path.resolve(__dirname, "../log4js.json"));

module.exports = log4js;
