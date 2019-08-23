module.exports = (req, res, next) => {
  const userAgent = req.get("User-Agent");
  if (userAgent) {
    // google爬虫
    if (userAgent.indexOf("Googlebot") !== -1) {
      // Access is not allowed
      res.status(403).end();
      return;
    }
  }
  next();
}
