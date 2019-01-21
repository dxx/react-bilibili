import * as React from "react";
import LazyLoad from "react-lazyload";
import ScrollToTop from "../../components/scroll-to-top/ScrollToTop";
import { getSearchResult } from "../../api/search";
import { Video, UpUser, createVideoBySearch } from "../../models";
import { formatTenThousand, formatDuration } from "../../util/string";
import { getPicSuffix } from "../../util/image";
import Context from "../../context";

import tips from "../../assets/images/tips.png";
import style from "./result.styl?css-modules";

interface ResultProps {
  keyword: string;
  staticContext?: { picSuffix: string };
}

interface ResultState {
  loading: boolean;
  videos: Video[];
  upUsers: any[];
  upUserCount: number;
}

enum OrderType {
  TOTALRANK = "totalrank", // 默认
  CLICK = "click", // 播放多
  PUBDATA = "pubdate", // 发布日期
  DM = "dm" // 弹幕
}

enum SearchType {
  ALL = "all", // 全部
  UPUSER = "upuser" // up主
}

class Result extends React.Component<ResultProps, ResultState> {
  private resultRef: React.RefObject<HTMLDivElement>;
  private orderType: OrderType = OrderType.TOTALRANK;
  private searchType: SearchType = SearchType.ALL;
  private page: { pageNumber: number, pageSize: number } = {
    pageNumber: 1,
    pageSize: 20
  };
  constructor(props) {
    super(props);

    this.resultRef = React.createRef();

    this.state = {
      loading: true,
      videos: [],
      upUsers: [],
      upUserCount: 0
    }
  }
  public componentDidMount() {
    this.getResult();

    window.addEventListener("scroll", this.handleScroll);
  }
  public componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
  private handleScroll = () => {
    const resultDOM = this.resultRef.current;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const height = window.innerHeight;
    const contentHeight = resultDOM.offsetHeight;
    // 滚动到底部，加载下一页数据
    if (scrollTop >= contentHeight - height) {
      // 最大加载5页
      this.page.pageNumber += 1;
      if (this.page.pageNumber <= 5) {
        this.getResult();
      }
    }
  }
  private getResult() {
    getSearchResult({
      keyword: this.props.keyword,
      page: this.page.pageNumber,
      size: this.page.pageSize,
      searchType: this.searchType,
      order: this.orderType,
    }).then((result) => {
      if (result.code === "1") {
        let videos = [];
        let upUsers = [];
        let upUserCount = this.state.upUserCount;
        if (this.searchType === SearchType.ALL) {  // 综合
          videos = result.data.result.video.map((item) => createVideoBySearch(item));
          upUserCount = result.data.pageInfo.upuser.numResults;
        } else {  // up主
          upUsers = result.data.result.map((item) => ({
              videoCount: item.videos,
              ...new UpUser(
                item.mid,
                item.uname,
                item.upic,
                item.level,
                "",
                item.usign,
                0,
                item.fans
              )
            })
          );
        }

        this.setState({
          loading: false,
          videos: this.state.videos.concat(videos),
          upUsers: this.state.upUsers.concat(upUsers),
          upUserCount
        })
      }
    })
  }
  private changeSearchType(searchType: SearchType) {
    if (this.searchType !== searchType) {
      this.searchType = searchType;
      this.page.pageNumber = 1;
      this.setState({
        loading: true
      });
      this.getResult();
    }
  }
  private changeOrderType(orderType: OrderType) {
    if (this.orderType !== orderType) {
      this.orderType = orderType;
      this.page.pageNumber = 1;
      this.setState({
        loading: true,
        videos: []
      });
      this.getResult();
    }
  }
  private getPicUrl(url, format) {
    const { picURL } = this.context;
    const suffix = getPicSuffix();
    // 默认头像
    if (url.indexOf(".gif") !== -1) {
      return `${picURL}?pic=${url}`;
    }
    return `${picURL}?pic=${url}${format + suffix}`;
  }
  public render() {
    return (
      <div className={style.resultContainer} ref={this.resultRef}>
        <div className={style.tabContainer}>
          <div className={style.tabItem}>
            <div className={style.item + (this.searchType === SearchType.ALL ? " " + style.current : "")}
              onClick={() => {this.changeSearchType(SearchType.ALL)}}>综合</div>
          </div>
          <div className={style.tabItem}>
            <div className={style.item + (this.searchType === SearchType.UPUSER ? " " + style.current : "")}
              onClick={() => {this.changeSearchType(SearchType.UPUSER)}}>UP主{
                this.state.upUserCount > 0 ? (
                  this.state.upUserCount > 100 ? ("(99+)") :
                  `(${this.state.upUserCount})`
                ) : ""
              }</div>
          </div>
        </div>
        {
          this.searchType === SearchType.ALL ? (
            <div className={style.resultWrapper}>
              <div className={style.subTab}>
                <div className={style.sort + (this.orderType === OrderType.TOTALRANK ? " " + style.current : "")}
                  onClick={() => {this.changeOrderType(OrderType.TOTALRANK)}}>默认排序</div>
                <div className={style.sort + (this.orderType === OrderType.CLICK ? " " + style.current : "")}
                  onClick={() => {this.changeOrderType(OrderType.CLICK)}}>播放多</div>
                <div className={style.sort + (this.orderType === OrderType.PUBDATA ? " " + style.current : "")}
                  onClick={() => {this.changeOrderType(OrderType.PUBDATA)}}>新发布</div>
                <div className={style.sort + (this.orderType === OrderType.DM ? " " + style.current : "")}
                  onClick={() => {this.changeOrderType(OrderType.DM)}}>弹幕多</div>
              </div>
              <div className={style.videoList}>
                {
                  this.state.videos.map((video, i) => (
                    <div className={style.videoWrapper} key={video.aId + i + ""}>
                      <a href={"/video/av" + video.aId}>
                        <div className={style.imageContainer}>
                            <LazyLoad height={"3.654rem"}>
                              <img src={this.getPicUrl("https:" + video.pic, "@200w_125h")} alt={video.title} />
                            </LazyLoad>
                            <div className={style.duration}>{formatDuration(video.duration, "0#:##:##")}</div>
                        </div>
                        <div className={style.infoWrapper}>
                          <p>{video.title}</p>
                          <div className={style.ownerWrapper}>
                            <span className={style.iconUp}/>
                            <span className={style.owner}>{video.owner.name}</span>
                          </div>
                          <div className={style.countInfo}>
                            <span className={style.iconPlay} />
                            <span className={style.playCount}>
                              {formatTenThousand(video.playCount)}
                            </span>
                            <span className={style.iconBarrage} />
                            <span className={style.barrageCount}>
                              {formatTenThousand(video.barrageCount)}
                            </span>
                          </div>
                        </div>
                      </a>
                    </div>
                  ))
                }
              </div>
            </div>
          ) : (
            <div className={style.upUserList}>
              {
                this.state.upUsers.map((user) => (
                  <div className={style.upUserWrapper} key={user.mId}>
                    <a href={"/space/" + user.mId}>
                      <div className={style.face}>
                        <LazyLoad height={"3rem"}>
                          <img src={this.getPicUrl("https:" + user.face, "@120w_120h")} alt={user.name} />
                        </LazyLoad>
                      </div>
                      <div className={style.upInfo}>
                        <div className={style.name}>{user.name}</div>
                        <div className={style.detail}>
                          <span>粉丝：{user.follower}</span>
                          <span>视频：{user.videoCount}</span>
                        </div>
                        <div className={style.sign}>{user.sign}</div>
                      </div>
                    </a>
                  </div>
                ))
              }
            </div>
          )
        }
        {
          this.page.pageNumber >= 5 ? (
          <div className={style.tips}>
            <img src={tips} />
            <span className={style.text}>刷到底了哟，从头再来吧 ~</span>
          </div>
          ) : null
        }
        {
          this.state.loading === true ? (
            <div className={style.loading}>
              (´・ω・｀)正在加载...
            </div>
          ) : null
        }
        <ScrollToTop />
      </div>
    );
  }
}

Result.contextType = Context;

export default Result;
