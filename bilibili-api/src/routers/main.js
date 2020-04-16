const express = require("express");
const {
  fetchRoundSowing
} = require("../api");
const router = express.Router();

const partitionData = {
  0: [
    {tid: 1, typename: "动画"}, {tid: 13, typename: "番剧"}, {tid: 167, typename: "国创"},
    {tid: 3, typename: "音乐"}, {tid: 129, typename: "舞蹈"}, {tid: 4, typename: "游戏"},
    {tid: 36, typename: "科技"}, {tid: 188, typename: "数码"}, {tid: 160, typename: "生活"},
    {tid: 119, typename: "鬼畜"}, {tid: 155, typename: "时尚"}, {tid: 5, typename: "娱乐"},
    {tid: 181, typename: "影视"}, {tid: 166, typename: "广告"}, {tid: 177, typename: "纪录片"},
    {tid: 23, typename: "电影"}, {tid: 11, typename: "电视剧"}
  ],
  1: [
    {tid: 33, typename: "MAD·AMV"}, {tid: 32, typename: "MMD·3D"}, {tid: 51, typename: "短片·手书·配音"},
    {tid: 152, typename: "特摄"}, {tid: 27, typename: "综合"}
  ],
  13: [],
  167: [
    {tid: 153, typename: "国产动画"}, {tid: 168, typename: "国产原创相关"}, {tid: 169, typename: "布袋戏"},
    {tid: 195, typename: "动态漫·广播剧"}, {tid: 170, typename: "资讯"}
  ],
  3: [
    {tid: 28, typename: "原创音乐"}, {tid: 31, typename: "翻唱"}, {tid: 30, typename: "VOCALOID·UTAU"},
    {tid: 194, typename: "电音"}, {tid: 59, typename: "演奏"}, {tid: 193, typename: "MV"},
    {tid: 29, typename: "音乐现场"}, {tid: 130, typename: "音乐综合"}
  ],
  129: [
    {tid: 20, typename: "宅舞"}, {tid: 198, typename: "街舞"}, {tid: 199, typename: "明星舞蹈"},
    {tid: 200, typename: "中国舞"}, {tid: 154, typename: "舞蹈综合"}, {tid: 156, typename: "舞蹈教程"}
  ],
  4: [
    {tid: 17, typename: "单机游戏"}, {tid: 171, typename: "电子竞技"}, {tid: 172, typename: "手机游戏"},
    {tid: 65, typename: "网络游戏"}, {tid: 173, typename: "桌游棋牌"}, {tid: 121, typename: "GMV"},
    {tid: 136, typename: "音游"}, {tid: 19, typename: "Mugen"}
  ],
  36: [
    {tid: 124, typename: "趣味科普人文" }, {tid: 122, typename: "野生技术协会"}, {tid: 39, typename: "演讲·公开课"},
    {tid: 96, typename: "星海"}, {tid: 98, typename: "机械"}, {tid: 176, typename: "汽车"}
  ],
  188: [
    {tid: 95, typename: "手机平板"}, {tid: 189, typename: "电脑装机"}, {tid: 190, typename: "摄影摄像"},
    {tid: 191, typename: "影音智能"}
  ],
  160: [
    {tid: 138, typename: "搞笑"}, {tid: 21, typename: "日常"}, {tid: 76, typename: "美食圈"},
    {tid: 75, typename: "动物圈"}
  ],
  119: [
    {tid: 22, typename: "鬼畜调教"}, {tid: 26, typename: "音MAD"}, {tid: 126, typename: "人力VOCALOID"},
    {tid: 127, typename: "教程演示"}
  ],
  155: [
    {tid: 157, typename: "美妆"}, {tid: 158, typename: "服饰"}, {tid: 164, typename: "健身"},
    {tid: 159, typename: "T台"}, {tid: 192, typename: "风尚标"}
  ],
  5: [
    {tid: 71, typename: "综艺"}, {tid: 137, typename: "明星"}, {tid: 131, typename: "Korea相关"}
  ],
  181: [
    {tid: 182, typename: "影视杂谈"}, {tid: 183, typename: "影视剪辑"}, {tid: 85, typename: "短片"},
    {tid: 184, typename: "预告·资讯"}
  ],
  166: [{tid: 166, typename: "广告"}],
  177: [],
  11: [],
  23: []
}


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
  const resData = {
    code: "1",
    msg: "success",
    data: partitionData
  }
  res.send(resData);
});

module.exports = router;
