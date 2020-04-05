<p align="center">
  <a href="https://github.com/facebook/react"><img src="https://img.shields.io/badge/react-v16.8.6-blue.svg" alt="react"></a>
  <a href="https://github.com/ReactTraining/react-router"><img src="https://img.shields.io/badge/react--router-v4.3.1-blue.svg" alt="react-router"></a>
  <a href="https://github.com/reactjs/redux"><img src="https://img.shields.io/badge/redux-v4.0.1-blue.svg" alt="redux"></a>
  <a href="https://github.com/reactjs/react-redux"><img src="https://img.shields.io/badge/react--redux-v5.1.1-blue.svg" alt="react-redux"></a>
  <a href="https://github.com/nfl/react-helmet"><img src="https://img.shields.io/badge/react--helmet-v6.0.0-blue.svg" alt="react-helmet"></a>
  <a href="https://github.com/jasonslyvia/react-lazyload"><img src="https://img.shields.io/badge/react--lazyload-v2.3.0-yellow.svg" alt="react-lazyload"></a>
</p>

# react-bilibili
高仿B站web移动端

> 此项目仅供学习和交流

##
本项目基于此[SSR服务端渲染](https://github.com/code-mcx/react-ssr)模板，使用React16.8，Typescript开发

## 技术点
* react
* react-router-dom
* react-router-config
* redux(数据管理)
* redux-thunk(支持异步Action)
* react-helmet(Head管理)
* react-lazyload(图片懒加载)
* loadable-components(代码分割)
* cross-fetch(浏览器和node通用的Fetch API)
* express(后端服务)

## 实现功能
* 首页
* 分类页
* 排行榜
* 搜索
* 视频详情页<br/>
  1.视频播放<br/>
  2.弹幕<br/>
  3.推荐列表<br/>
  4.评论列表
* UP主页<br/>
  1.详情<br/>
  2.投稿列表
* 个人中心<br/>
  历史记录
* 直播
* 直播列表
* 分类
* 直播间<br/>
  1.直播播放<br/>
  2.聊天弹幕

## 运行

> 先运行服务端接口，见`bilibili-api`目录。默认端口: 3010

### `npm install`
安装项目依赖包

### `npm run dev`
运行开发环境

### `npm run build`
打包客户端和服务端，运行生产环境前必须先打包

### `npm run start`
运行生产环境

## 屏幕截图
<p align="center">
  <img src="https://code-mcx.github.io/react-bilibili/screenshots/01_index.png" width="326px" height="680px" alt="index" />
  <img src="https://code-mcx.github.io/react-bilibili/screenshots/02_channel.png" width="326px" height="680px" alt="channel" />

  <img src="https://code-mcx.github.io/react-bilibili/screenshots/03_ranking.png" width="326px" height="680px" alt="ranking" />
  <img src="https://code-mcx.github.io/react-bilibili/screenshots/04_detail.png" width="326px" height="680px" alt="detail" />

  <img src="https://code-mcx.github.io/react-bilibili/screenshots/05_detail.png" width="326px" height="680px" alt="detail" />
  <img src="https://code-mcx.github.io/react-bilibili/screenshots/06_space.png" width="326px" height="680px" alt="space" />

  <img src="https://code-mcx.github.io/react-bilibili/screenshots/07_search.png" width="326px" height="680px" alt="search" />
  <img src="https://code-mcx.github.io/react-bilibili/screenshots/08_history.png" width="326px" height="680px" alt="history" />

  <img src="https://code-mcx.github.io/react-bilibili/screenshots/09_live.png" width="326px" height="680px" alt="live" />
  <img src="https://code-mcx.github.io/react-bilibili/screenshots/10_live_list.png" width="326px" height="680px" alt="live list" />

  <img src="https://code-mcx.github.io/react-bilibili/screenshots/11_room.png" width="326px" height="680px" alt="room" />
  <img src="https://code-mcx.github.io/react-bilibili/screenshots/12_room.png" width="326px" height="680px" alt="room" />
</p>