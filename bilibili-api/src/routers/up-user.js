const express = require("express");
const {
  fetchUserData,
  fetchUserVideo
} = require("../api");
const router = express.Router();

router.get("/up/:uId", (req, res, next) => {
  if (req.path === "/up/video") {
    next();
    return;
  }
  fetchUserData(req.params.uId).then((data) => {
    const resData = {
      code: "1",
      msg: "success",
      data
    }
    res.send(resData);
  }).catch(next);
});

router.get("/up/video", (req, res, next) => {
  const param = {
    uId: req.query.uId,
    p: req.query.p,
    size: req.query.size
  }
  fetchUserVideo(param).then((data) => {
    let resData = {
      code: "1",
      msg: "success",
      data
    }
    res.send(resData);
  }).catch(next);
});


module.exports = router;
