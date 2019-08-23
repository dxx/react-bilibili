const express = require("express");
const { 
  fetchIndexData,
  fetchPartitionData,
  fetchRoundSowing
} = require("../api");
const router = express.Router();

// 首页列表
router.get("/index", (req, res, next) => {
  fetchIndexData().then((data) => {
    const resData = {
      code: "1",
      msg: "success",
      data
    }
    res.send(resData);
  }).catch(next);
});

// 首页轮播图
router.get("/round-sowing", (req, res, next) => {
  fetchRoundSowing().then((data) => {
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

// 分类
router.get("/partitions", (req, res, next) => {
  fetchPartitionData().then((data) => {
    const resData = {
      code: "1",
      msg: "success",
      data
    }
    res.send(resData);
  }).catch(next);
});

module.exports = router;
