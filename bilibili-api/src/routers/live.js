const express = require("express");
const {
  fetchLiveList,
  fetchLiveArea,
  fetchLiveUrl,
  fetchLiveGift,
  fetchRoomList,
  fetchRoomInfo,
  fetchDanMuConfig
} = require("../api");
const router = express.Router();

// 直播首页
router.get("/live/data", (req, res, next) => {
  fetchLiveList().then((data) => {
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

// 直播分类
router.get("/live/area", (req, res, next) => {
  fetchLiveArea().then((data) => {
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

// 房间列表
router.get("/live/room/list", (req, res, next) => {
  fetchRoomList(req.query).then((data) => {
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

// 房间信息
router.get("/live/room/info", (req, res, next) => {
  fetchRoomInfo(req.query.roomId).then((data) => {
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

// 直播礼物
router.get("/live/room/gifts", (req, res, next) => {
  fetchLiveGift().then((data) => {
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

// 直播地址
router.get("/live/room/play_url", (req, res, next) => {
  fetchLiveUrl(req.query.roomId).then((data) => {
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

// 弹幕配置
router.get("/live/room/danmu_config", (req, res, next) => {
  fetchDanMuConfig(req.query.roomId).then((data) => {
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
