const express = require("express");
const fetch = require("node-fetch");
const fileType = require("file-type");
const router = express.Router();
const whiteList = process.env.WHITE_LIST.split(",");

router.use("/transfer", (req, res, next) => {
  // 验证Referer
  const referer = req.get("Referer");
  if (referer) {
    let newWhiteList =  [...whiteList];
    // 添加当前url到白名单
    newWhiteList.push(`${req.protocol}://${req.hostname}`);
    const allowOrigin = newWhiteList.find((url) => referer.indexOf(url) !== -1);
    if (allowOrigin) {
      next();
    } else {
      // Access is not allowed
      res.status(403).end();
    }
  } else {
    next();
  }
});

router.get("/transfer/image", (req, res, next) => {
  const url = req.query.pic;
  fetch(url)
    .then(res => res.buffer())
    .then(buffer => {
      res.set("Content-Type", fileType(buffer).mime);
      res.send(buffer);
    }).catch(next);
});

router.get("/transfer/mp4", (req, res, next) => {
  const range = req.get("Range");
  let start = 0;
  let end = "";
  let code = 200;
  if (range) {
    // 获取range start 和 end
    const result = range.match(/bytes=(\d+)-(\d*)/);
    if (result !== null) {
      start = result[1];
      end = result[2];
    }
    code = 206;
  }
  const url = req.query.video;
  fetch(url, {
    headers: {
      Range: `bytes=${start}-${end}`
    }
  }).then(response => {
    const headers = response.headers;
    res.set("Cache-Control", "public, max-age=0");
    // 支持断点传输
    res.set("Accept-Ranges", "bytes");
    res.set("Content-Type", "video/mp4");
    res.set("Content-Range", headers.get("Content-Range"));
    res.set("Content-Length", headers.get("Content-Length"));
    res.set("ETag", headers.get("ETag"));
    res.set("Last-Modified", headers.get("Last-Modified"));
    res.status(code);
    // stream.Readable
    const readable = response.body;
    readable.pipe(res);
  }).catch(next);
});

module.exports = router;
