const express = require("express");
const {
  fetchRankingPartition,
  fetchRankingById,
  fetchRankingRegionById,
  fetchRankingArchiveById
} = require("../api");
const router = express.Router();

router.get("/ranking/partitions", (req, res, next) => {
  fetchRankingPartition().then((data) => {
    const resData = {
      code: "1",
      msg: "success",
      data
    }
    res.send(resData);
  }).catch(next);
});

router.get("/ranking/region", (req, res, next) => {
  const rId = req.query.rId;
  const day = req.query.day;
  fetchRankingRegionById(rId, day).then((data) => {
    let resData = {
      code: "1",
      msg: "success"
    }
    if (data.code === 0) {
      resData.data = data.data;
    } else {
      resData.code = "0";
      resData.msg = "fail";
    }
    res.send(resData);
  }).catch(next);
});

router.get("/ranking/archive", (req, res, next) => {
  let tId = req.query.tId;
  let p = req.query.p;
  fetchRankingArchiveById(tId, p).then((data) => {
    let resData = {
      code: "1",
      msg: "success"
    }
    if (data.code === 0) {
      resData.data = data.data;
    } else {
      resData.code = "0";
      resData.msg = "fail";
    }
    res.send(resData);
  }).catch(next);
});

router.get("/ranking/:rId", (req, res, next) => {
  fetchRankingById(req.params.rId).then((data) => {
    let resData = {
      code: "1",
      msg: "success"
    }
    if (data.code === 0) {
      resData.data = data.data;
    } else {
      resData.code = "0";
      resData.msg = "fail";
    }
    res.send(resData);
  }).catch(next);
});

module.exports = router;
