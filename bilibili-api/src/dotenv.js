const path = require("path");
const dotenv = require("dotenv");

const env = process.env.NODE_ENV === "production" ? "prod" : "dev";
// Config environment variables
dotenv.config({
  path: path.resolve(process.cwd(), `.env.${env}`)
});
