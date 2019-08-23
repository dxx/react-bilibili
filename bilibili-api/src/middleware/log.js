const log4js = require("../log4js");

const logger = log4js.getLogger(process.env.LOG_CATEGORY);

module.exports = (req, res, next) => {
  logger.info("====== Visit api server ======");
  logger.info(`url: ${req.url}`);
  const path = req.path;
  if (path.indexOf("transfer") === -1) {
    const query = req.query;
    const body =  req.body;
    logger.info(`origin: ${req.get("Origin")}`);
    logger.info(`query: ${JSON.stringify(query)}`);
    logger.info(`body: ${JSON.stringify(body)}`);
  } else if (path.indexOf("transfer") !== -1) {
    logger.info(`referer: ${req.get("Referer")}`);
  }
  next();
}
