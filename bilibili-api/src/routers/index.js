const express = require("express");
const mainRouter = require("./main");
const rankingRouter = require("./ranking");
const videoRouter = require("./video");
const upUserRouter = require("./up-user");
const searchRouter = require("./search");
const transferRouter = require("./transfer");

const liveRouter = require("./live");

const router = express.Router();

router.use(mainRouter);
router.use(rankingRouter);
router.use(videoRouter);
router.use(upUserRouter);
router.use(searchRouter);
router.use(transferRouter);
router.use(liveRouter);

module.exports = router;
