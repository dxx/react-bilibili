const express = require("express");
const {
  fetchHotWord,
  fetchSuggest,
  fetchSearchContent
} = require("../api");
const router = express.Router();

router.get("/search/hotword", (req, res, next) => {
  fetchHotWord().then((data) => {
    let resData = {
      code: "1",
      msg: "success"
    }
    if (data.code === 0) {
      resData.data = data.list;
    } else {
      resData.code = "0";
      resData.msg = "fail";
    }
    res.send(resData);
  }).catch(next);
});

router.get("/search/suggest", (req, res, next) => {
  const w = encodeURI(req.query.w);
  fetchSuggest(w).then((data) => {
    let resData = {
      code: "1",
      msg: "success"
    }
    if (data.code === 0) {
      resData.data = data.result;
    } else {
      resData.code = "0";
      resData.msg = "fail";
    }
    res.send(resData);
  }).catch(next);
});

router.post("/search", (req, res, next) => {
  const param = {
    keyword: req.body.keyword,
    page: req.body.page,
    size: req.body.size,
    searchType: req.body.searchType,
    order: req.body.order,
  }
  fetchSearchContent(param).then((data) => {
    let resData = {
      code: "1",
      msg: "success",
      data: {}
    }
    if (data.code === 0) {
      resData.data.numPages = data.data.numPages;
      resData.data.numResults = data.data.numResults;
      resData.data.page = data.data.page;
      resData.data.size = data.data.pagesize;
      resData.data.result = data.data.result ? data.data.result : [];
    } else {
      resData.code = "0";
      resData.msg = "fail";
    }
    res.send(resData);
  }).catch(next);
});

module.exports = router;
