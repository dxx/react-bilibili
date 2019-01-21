import * as React from "react";
import { Link, match } from "react-router-dom";
import { Helmet } from "react-helmet";
import LazyLoad from "react-lazyload";
import { History } from "history";
import Header from "../../components/header/Header";
import ScrollToTop from "../../components/scroll-to-top/ScrollToTop";
import Context from "../../context";
import VideoPlayer from "./VideoPlayer";
import { Video, createVideo, UpUser } from "../../models";
import { formatTenThousand, formatDuration } from "../../util/string";
import { getRecommendVides, getComments } from "../../api/video";
import { getPicSuffix } from "../../util/image";
import storage from "../../util/storage";

import style from "./detail.styl?css-modules";

const getPubdate = (timestamp) => {
  const publicDate = new Date(timestamp * 1000); // unix时间转换成本地时间戳
  let publicDateStr = "";
  const date = new Date();
  if (publicDate.getFullYear() === date.getFullYear()) {
    if (publicDate.getMonth() === date.getMonth()) {
      const diffDate = date.getDate() - publicDate.getDate();
      switch (diffDate) {
        case 0:
          if (date.getHours() - publicDate.getHours() === 0) {
            publicDateStr = date.getMinutes() - publicDate.getMinutes() + "分钟前";
          } else {
            publicDateStr = date.getHours() - publicDate.getHours() + "小时前";
          }
          break;
        case 1:
          publicDateStr = "昨天";
        case 2:
          publicDateStr = "前天";
        default:
          publicDateStr = publicDate.getMonth() + 1 + "-" + publicDate.getDate();
      }
    } else {
      publicDateStr = publicDate.getMonth() + 1 + "-" + publicDate.getDate();
    }
  } else {
    publicDateStr = publicDate.getFullYear() + "-" +
      (publicDate.getMonth() + 1) + "-" +
      publicDate.getDate();
  }
  return publicDateStr;
}

interface DetailProps {
  video: Video;
  match: match<{aId}>;
  history: History;
  staticContext?: { picSuffix: string };
}

interface DetailState {
  loading: boolean;
  recommendVides: Video[];
  showLoadMore: boolean;
  comments: any;
}

class Detail extends React.Component<DetailProps, DetailState> {
  private arrowRef: React.RefObject<HTMLDivElement>;
  private infoContainerRef: React.RefObject<HTMLDivElement>;
  private infoRef: React.RefObject<HTMLDivElement>;
  private infoExpand: boolean;
  private commentPage: { pageNumber: number, pageSize: number, count: number };
  constructor(props) {
    super(props);

    this.arrowRef = React.createRef();
    this.infoContainerRef = React.createRef();
    this.infoRef = React.createRef();
    this.infoExpand = false;
    this.commentPage = {
      pageNumber: 1,
      pageSize: 20,
      count: 0
    };

    this.state = {
      loading: true,
      recommendVides: [],
      showLoadMore: true,
      comments: []
    }
  }
  public componentDidMount() {
    this.getRecommentVides();
    this.getComments();

    // 记录当前视频信息
    const { video } = this.props;
    storage.setViewHistory({
      aId: video.aId,
      title: video.title,
      pic: video.pic,
      viewAt: new Date().getTime()
    });
  }
  private getRecommentVides() {
    getRecommendVides(this.props.match.params.aId).then((result) => {
      if (result.code === "1") {
        const recommendVides = result.data.map((item) => createVideo(item));
        this.setState({
          loading: false,
          recommendVides
        });
      }
    });
  }
  private getComments() {
    getComments(this.props.match.params.aId, this.commentPage.pageNumber).then((result) => {
      if (result.code === "1") {

        const page = result.data.page;
        const maxPage = Math.ceil(page.count / page.size);
        const showLoadMore = this.commentPage.pageNumber < maxPage ? true : false;

        this.commentPage = {
          pageNumber: this.commentPage.pageNumber,
          pageSize: page.size,
          count: page.count
        }
        let comments = [];
        if (result.data.replies) {
          comments = result.data.replies.map((item) => {
            let date: any = new Date(item.ctime * 1000); // unix时间转换成本地时间戳
            date = date.getMonth() + 1 + "-" + date.getDate();
            return {
              content: item.content.message,
              date,
              user: {...new UpUser(item.member.mid, item.member.uname, item.member.avatar)}
            }
          });
        }
        this.setState({
          showLoadMore,
          comments: this.state.comments.concat(comments)
        });
      }
    });
  }
  /**
   * 展开或隐藏全部信息
   */
  private toggle = () => {
    const arrowDOM = this.arrowRef.current;
    const infoContainerDOM = this.infoContainerRef.current;
    const infoDOM = this.infoRef.current;
    const titleDOM = infoDOM.getElementsByTagName("div")[0];
    if (this.infoExpand === false) {
      titleDOM.style.whiteSpace = "normal";
      infoContainerDOM.style.height = infoDOM.offsetHeight + "px";
      arrowDOM.classList.add(style.rotate);
      this.infoExpand = true;
    } else {
      titleDOM.style.whiteSpace = "nowrap";
      infoContainerDOM.style.height = null;
      arrowDOM.classList.remove(style.rotate);
      this.infoExpand = false;
    }
  }
  private loadMoreComment() {
    this.commentPage.pageNumber += 1;
    this.getComments();
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
    // 默认头像
    if (url.indexOf(".gif") !== -1) {
      return `${picURL}?pic=${url}`;
    }
    return `${picURL}?pic=${url}${format + suffix}`;
  }
  private toSpace(mId) {
    this.props.history.push({
      pathname: "/space/" + mId
    });
  }
  public render() {
    const { video } = this.props;

    if (video.pic.indexOf("@400w_300h") === -1) {
      video.pic = this.getPicUrl(video.pic, "@400w_300h");
    }

    return (
      <div className="video-detail">
        <Helmet>
          <title>{video.title}</title>
          <meta name="title" content={video.title} />
          <meta name="description" content={video.desc} />
          <meta name="author" content={video.owner.name} />
        </Helmet>
        <div className={style.topWrapper}>
          <Header />
        </div>
        {/* 内容 */}
        <div className={style.contentWrapper}>
          <div className={style.videoContainer}>
            <VideoPlayer video={video} />
          </div>
          {/* 视频信息 */}
          <div className={style.videoInfoContainer} ref={this.infoContainerRef}>
            <i className={`icon-arrow-down ${style.iconArrow}`} ref={this.arrowRef}
              onClick={this.toggle} />
            <div className={style.infoWrapper} ref={this.infoRef}>
              <div className={style.title}>
                {video.title}
              </div>
              <div className={style.videoInfo}>
                <Link to={"/space/" + video.owner.mId}>
                  <span className={style.upUserName}>{video.owner.name}</span>
                </Link>
                <span className={style.play}>{formatTenThousand(video.playCount)}次观看</span>
                <span>{formatTenThousand(video.barrageCount)}弹幕</span>
                <span>{getPubdate(video.publicDate)}</span>
              </div>
              <div className={style.desc}>
                {video.desc}
              </div>
              <div className={style.position}>
                <a href="/index">主页</a>
                <span>></span>
                <a href={"/channel/" + video.oneLevel.id}>{video.oneLevel.name}</a>
                <span>></span>
                <a href={"/channel/" + video.twoLevel.id}>{video.twoLevel.name}</a>
                <span>></span>
                <span className={style.aid}>av{video.aId}</span>
              </div>
            </div>
          </div>
          {/* 推荐列表 */}
          <div className={style.recommendList}>
            {
              this.state.recommendVides.map((v) => (
                <div className={style.videoWrapper} key={v.aId}>
                  <a href={"/video/av" + v.aId}>
                    <div className={style.imageContainer}>
                      <LazyLoad height="10.575rem">
                        <img src={this.getPicUrl("https:" + v.pic, "@320w_200h")} alt={v.title} />
                      </LazyLoad>
                      <div className={style.duration}>{formatDuration(v.duration, "0#:##:##")}</div>
                    </div>
                    <div className={style.infoWrapper}>
                      <div className={style.title}>
                        {v.title}
                      </div>
                      <div className={style.upUser}>
                        <span onClick={(e) => { e.preventDefault(); this.toSpace(v.owner.mId)}}>
                          {v.owner.name}
                        </span>
                      </div>
                      <div className={style.videoInfo}>
                        <span>{formatTenThousand(v.playCount)}次观看</span>
                        <span>&nbsp;·&nbsp;</span>
                        <span>{formatTenThousand(v.barrageCount)}弹幕</span>
                      </div>
                    </div>
                  </a>
                </div>
              ))
            }
            {
              this.state.loading === true ? (
                <div className={style.loading}>加载中...</div>
              ) : null
            }
          </div>
          {
            this.state.comments.length > 0 ? (
              <div className={style.comment}>
                <div className={style.commentTitle}>
                  评论<span className={style.commentCount}>(&nbsp;{this.commentPage.count}&nbsp;)</span>
                </div>
                <div className={style.commentList}>
                {
                  this.state.comments.map((comment, i) => (
                    <div className={style.commentWrapper}  key={i}>
                      <Link to={"/space/" + comment.user.mId}>
                        <LazyLoad height="2rem">
                          <img className={style.commentUpPic} src={this.getPicUrl(comment.user.face, "@60w_60h")}
                            alt={comment.user.name}/>
                        </LazyLoad>
                      </Link>
                      <span className={style.commentTime}>{comment.date}</span>
                      <div className={style.commentUpUser}>
                        <Link to={"/space/" + comment.user.mId}>
                          {comment.user.name}
                        </Link>
                      </div>
                      <div className={style.commentContent}>
                        {comment.content}
                      </div>
                    </div>
                  ))
                }
                </div>
                {
                  this.state.showLoadMore === true ? (
                    <div className={style.loadMore} onClick={() => {this.loadMoreComment()}}>
                      点击加载更多评论
                    </div>
                  ) : (
                    <div className={style.noMore}>
                      没有更多了 ~
                    </div>
                  )
                }
              </div>
            ) : null
          }
        </div>
        <ScrollToTop />
      </div>
    );
  }
}

Detail.contextType = Context;

export default Detail;
