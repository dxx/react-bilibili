import * as React from "react";
import { match } from "react-router-dom";
import { Helmet } from "react-helmet";
import { History } from "history";
import Header from "../../components/header/Header";
import TabBar from "../../components/tab-bar/TabBar";
import VideoItem from "../../components/video-item/VideoItem";
import Drawer from "../../components/drawer/Drawer";
import { PartitionType, createPartitionTypes, Video, createVideoByRanking } from "../../models";
import Partition from "./Partition";
import VideoLatest from "./VideoLatest";
import { getRankingRegion } from "../../api/ranking";
import { getRankingPartitions } from "../../api/partitions";
import Context from "../../context";
import { getPicSuffix } from "../../util/image";

import style from "./channel.styl?css-modules";

interface ChannelProps {
  partitions: PartitionType[];
  match: match<{rId}>;
  history: History;
  staticContext?: { picSuffix: string };
}

interface ChannelState {
  recommendVideos: Video[];
  partitions: any;
}

const initVideos = [];
for (let i = 0; i < 4; i++) {
  initVideos.push(new Video(0, "加载中...", "", "", 0, 0, 0, 0, 0, ""));
}

class Channel extends React.Component<ChannelProps, ChannelState> {
  private drawerRef: React.RefObject<Drawer>;
  private currentSecondTabIndex: number;
  private currentPartition: PartitionType;
  private rankingPartitions: PartitionType[];
  constructor(props) {
    super(props);

    this.drawerRef = React.createRef();
    this.rankingPartitions = [];

    this.state = {
      recommendVideos: initVideos,
      partitions: []
    };
  }
  /**
   * 组件render前调用（实例化或update），返回的值更新state，返回null不更新state
   */
  public static getDerivedStateFromProps(props, state) {
    // 将上一次传入的rId传入state，render前进行比较，清除之前加载的数据
    const rId = parseInt(props.match.params.rId, 10);
    if (rId !== state.prevId) {
      return {
        recommendVideos: initVideos,
        partitions: [],
        prevId: rId
      };
    }
    return null;
  }
  /**
   * 组件udpate前调用，可以返回数据，在componentDidUpdate中接受
   */
  public getSnapshotBeforeUpdate() {
    return document.documentElement.scrollTop || document.body.scrollTop > 0 ? true : false;
  }
  public componentDidUpdate(prevProps, prevState, scroll) {
    const prevId = parseInt(prevProps.match.params.rId, 10);
    if (this.currentSecondTabIndex === 0) { // 表示一级分类
      // id变更加载数据
      if (prevId !== this.currentPartition.id) {
        this.loadRecommndData();
        this.loadPartionData();
      }
    } else {
      // currentSecondTabIndex为添加'推荐'分类后的索引这里需要减1
      const secondPartition = this.currentPartition.children[this.currentSecondTabIndex - 1];
      if (prevId !== secondPartition.id) {
        this.loadRecommndData();
      }
    }
    // 窗口发生滚动，滚动最顶端
    if (scroll === true) {
      window.scrollTo(0, 0);
    }
  }
  public componentDidMount() {
    this.loadRecommndData();
    if (this.currentSecondTabIndex === 0) { // 表示一级分类
      this.loadPartionData();
    }

    // 获取排行榜页面分类
    getRankingPartitions().then((result) => {
      if (result.code === "1") {
        this.rankingPartitions = createPartitionTypes(result.data.partitions);
      }
    });
  }
  /**
   * 加载推荐视频
   */
  private loadRecommndData() {
    const rId = this.props.match.params.rId;
    getRankingRegion({rId, day: 7}).then((result) => {
      if (result.code === "1") {
        const datas = result.data.splice(0, 4);
        const recommendVideos = datas.map((data) => createVideoByRanking(data));
        this.setState({
          recommendVideos
        });
      }
    });
  }
  /**
   * 加载分类视频
   */
  private loadPartionData() {
    const secondPartitions = this.currentPartition.children;
    const promises = secondPartitions.map((partition) =>
      getRankingRegion({rId: partition.id, day: 7})
    );
    Promise.all(promises).then((results) => {
      const partitions = [];
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.code === "1") {
          const partition = secondPartitions[i];
          partitions.push({
            id: partition.id,
            name: partition.name,
            videos: result.data.splice(0, 4).map((data) => createVideoByRanking(data))
          });
        }
      }
      this.setState({
        partitions
      });
    })
  }
  /**
   * tabBar或drawer组件点击事件处理
   */
  private handleClick = (tab) => {
    // 直播
    if (tab.id === -1) {
      window.location.href = "/live";
      return;
    }
    if (tab.id === 0) {
      window.location.href = "/index";
    } else {
      // 跳转到当前路由，会触发当前组件update
      this.props.history.push({
        pathname: "/channel/" + tab.id
      });
      // 隐藏drawer组件
      if (this.drawerRef.current.pull === true) {
        this.drawerRef.current.hide();
      }
    }
  }
  private handleSecondClick = (tab) => {
    this.props.history.push({
      pathname: "/channel/" + tab.id
    });
  }
  private handleSwitchClick = () => {
    this.drawerRef.current.show();
  }
  private handleRankingClick = (currentPartition) => {
    if (this.rankingPartitions.length > 0) {
      // 从一级分类中查找
      if (this.rankingPartitions.findIndex((partition) =>
        partition.id === currentPartition.id) !== -1) {
        this.props.history.push({
          pathname: "/ranking/" + currentPartition.id
        });
      } else {
        // 从二级分类中查找
        const partitionType = this.rankingPartitions.find((partition) =>
          currentPartition.children.findIndex((p) =>
            p.id === partition.id) !== -1
        );
        this.props.history.push({
          pathname: "/ranking/" + partitionType.id
        });
      }
    }
  }
  private getPicUrl(url, format) {
    const { picURL } = this.context;
    let suffix = ".webp";
    if (process.env.REACT_ENV === "server") {
      // 服务端获取图片后缀
      suffix = this.props.staticContext.picSuffix;
    } else {
      suffix = getPicSuffix();
    }
    return `${picURL}?pic=${url}${format + suffix}`;
  }
  public render() {
    const { partitions, match: m } = this.props;

    // 一级分类
    const tabBarData = [{ id: 0, name: "首页", children: []} as PartitionType]
      .concat(partitions);

    tabBarData.push(new PartitionType(-1, "直播"));

    let currentTabIndex = tabBarData.findIndex((parittion) =>
      parittion.id === parseInt(m.params.rId, 10)
    );

    this.currentPartition = tabBarData[currentTabIndex];

    let secondTabIndex = 0;
    // 当前分类如果是二级分类
    if (!this.currentPartition) {
      // 从二级分类中查找一级分类
      currentTabIndex = tabBarData.findIndex((parittion) => {
        secondTabIndex = parittion.children.findIndex((child) =>
          child.id === parseInt(m.params.rId, 10)
        );
        return secondTabIndex !== -1;
      });
      // 二级分类在下方会插入'推荐'内容，让当前索引+1
      secondTabIndex += 1;
      this.currentPartition = tabBarData[currentTabIndex];
    }
    this.currentSecondTabIndex = secondTabIndex;

    // 二级分类
    const secondTabBarData = [{ id: this.currentPartition.id, name: "推荐"} as PartitionType]
      .concat(this.currentPartition.children);

    let secondPartition = null;
    if (secondTabIndex !== 0) {
      secondPartition = secondTabBarData[secondTabIndex];
    }
    /* 当前是一级分类并且二级分类有两个或以上 */
    const isOneLevelAndChildrenGtTwo = secondTabIndex === 0 && this.currentPartition.children.length > 1
      ? true : false;
    const videoLatestId = isOneLevelAndChildrenGtTwo === true
      ? m.params.rId : this.currentPartition.children.length > 1 // 二级分类有两个或以上取当前二级分类
      ? this.currentPartition.children[secondTabIndex - 1].id :
      this.currentPartition.children[0].id;  // 只有一个二级分类取第一个
    return (
      <div className="channel">
        <Helmet>
          <title>{this.currentPartition.name + (secondPartition ? "-" + secondPartition.name : "")}</title>
        </Helmet>
        {/* 顶部 */}
        <div className={style.topWrapper}>
          <Header />
          {/* 一级分类 */}
          <div className={style.partition}>
            <div className={style.tabBar}>
              <TabBar data={tabBarData} type={"indicate"} currentIndex={currentTabIndex}
                onClick={this.handleClick} />
            </div>
            <div className={style.switch} onClick={this.handleSwitchClick}>
              <i className="icon-arrow-down" />
            </div>
          </div>
          {/* 抽屉 */}
          <div className={style.drawerPosition}>
            <Drawer data={tabBarData} ref={this.drawerRef} currentIndex={currentTabIndex}
              onClick={this.handleClick} />
          </div>
          {
            this.currentPartition.children.length > 1 ? (
              <div className={style.secondTabBar}>
                <TabBar data={secondTabBarData} type={"hightlight"} currentIndex={secondTabIndex}
                  onClick={this.handleSecondClick}/>
              </div>
            ) : null
          }
        </div>
        <div className={this.currentPartition.children.length > 1 ? style.specialLine1 : style.specialLine2} />
        <div className={style.partitionWrapper}>
          {/* 分类推荐 */}
          <div className={style.recommend}>
            <div className={style.title}>热门推荐</div>
            {
              isOneLevelAndChildrenGtTwo === true ? (
                <div className={style.ranking} onClick={() => { this.handleRankingClick(this.currentPartition) }}>
                  <i className={`${style.iconRanking} icon-ranking`} />
                  <span className={style.text}>排行榜</span>
                  <i className={`${style.iconRight} icon-arrow-right`} />
                </div>
              ) : null
            }
            <div className={style.recommendContent + " clear"}>
              {
                this.state.recommendVideos.map((video, i) => {
                  if (video.pic && video.pic.indexOf("@320w_200h") === -1) {
                    video.pic = this.getPicUrl(video.pic, "@320w_200h");
                  }
                  return <VideoItem video={video} key={i} showStatistics={true} />
                })
              }
            </div>
          </div>
          {
            isOneLevelAndChildrenGtTwo === true ? (
              this.state.partitions.map((partition) =>
                <Partition data={partition} key={partition.id}
                  getPicUrl={(url, format) => this.getPicUrl(url, format)} />
              )
            ) : (
              <VideoLatest id={videoLatestId} getPicUrl={(url, format) => this.getPicUrl(url, format)} />
            )
          }
        </div>
      </div>
    );
  }
}

Channel.contextType = Context;

export default Channel;
