import * as React from "react";
import { match } from "react-router-dom";
import { Helmet } from "react-helmet";
import LazyLoad from "react-lazyload";
import ScrollToTop from "../../components/scroll-to-top/ScrollToTop";
import Context from "../../context";
import { UpUser as Model } from "../../models";
import { formatTenThousand } from "../../util/string";
import { getPicSuffix } from "../../util/image";
import { setShouldLoad } from "../../redux/actions";
import getUpUserInfo from "../../redux/async-actions/up-user";
import { getUserVideos } from "../../api/up-user";
import { Video, createVideoByUser } from "../../models";

import tips from "../../assets/images/nocontent.png";
import style from "./up-user.styl?css-modules";

interface UpUserProps {
  shouldLoad: boolean;
  upUser: Model;
  dispatch: (action: any) => Promise<void>;
  match: match<{mId}>;
  staticContext?: { picSuffix: string };
}

interface UpUserState {
  loading: boolean;
  showLoadMore: boolean;
  videos: Video[];
}

class UpUser extends React.Component<UpUserProps, UpUserState> {
  private arrowRef: React.RefObject<HTMLDivElement>;
  private introduceRef: React.RefObject<HTMLDivElement>;
  private contentRef: React.RefObject<HTMLDivElement>;
  private contentExpand: boolean;
  private sexClass: any;
  private videoPage: {pageNumber: number, pageSize: number};
  constructor(props) {
    super(props);

    this.arrowRef = React.createRef();
    this.introduceRef = React.createRef();
    this.contentRef = React.createRef();

    this.contentExpand = false;

    this.sexClass = {
      男: "icon-sex-man",
      女: "icon-sex-woman",
      保密: "icon-sex-secrecy"
    }

    this.videoPage = {
      pageNumber: 1,
      pageSize: 10
    }

    this.state = {
      loading: true,
      showLoadMore: true,
      videos: []
    }
  }
  public componentDidUpdate() {
    this.initToggle();
  }
  public componentDidMount() {
    this.initToggle();

    if (this.props.shouldLoad === true) {
      this.props.dispatch(getUpUserInfo(this.props.match.params.mId));
    } else {
      this.props.dispatch(setShouldLoad(true));
    }

    this.getUserVideos();
  }
  private getUserVideos() {
    getUserVideos(
      this.props.match.params.mId,
      this.videoPage.pageNumber,
      this.videoPage.pageSize).then((result) => {
        if (result.code === "1") {
          const vList = result.data.data.vlist;
          const videos = vList.map((data) => createVideoByUser(data));
          const showLoadMore = this.videoPage.pageNumber < result.data.data.pages ? true : false;
          this.setState({
            loading: false,
            showLoadMore,
            videos: this.state.videos.concat(videos)
          });
        }
    });
  }
  /**
   * 初始化展开箭头
   */
  private initToggle() {
    const arrowDOM = this.arrowRef.current;
    const introduceDOM = this.introduceRef.current;
    const contentDOM = this.contentRef.current;
    if (contentDOM.offsetHeight <= introduceDOM.offsetHeight) {
      arrowDOM.style.display = "none";
    } else {
      arrowDOM.style.display = "block";
    }
  }
  /**
   * 展开或隐藏个人签名
   */
  private toggle = () => {
    const arrowDOM = this.arrowRef.current;
    const introduceDOM = this.introduceRef.current;
    const contentDOM = this.contentRef.current;
    if (this.contentExpand === false) {
      introduceDOM.style.height = contentDOM.offsetHeight + "px";
      arrowDOM.classList.add(style.rotate);
      this.contentExpand = true;
    } else {
      introduceDOM.style.height = null;
      arrowDOM.classList.remove(style.rotate);
      this.contentExpand = false;
    }
  }
  private loadMoreVideos() {
    this.videoPage.pageNumber += 1;
    this.getUserVideos();
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
  public render() {
    const { upUser }  = this.props;
    return (
      <div className="up-user">
        {
          upUser ? (
            <Helmet>
              <title>{upUser.name + "的个人空间"}</title>
            </Helmet>
          ) : null
        }
        <div className={style.upUserContainer}>
          <div className={style.face}>
            {
              upUser.face ? (
                <img src={this.getPicUrl(upUser.face, "@160w_160h")} alt={upUser.name} />
              ) : null
            }
          </div>
          <div className={style.info}>
            <span className={style.name}>{upUser.name ? upUser.name : "--"}</span>
            <span className={`${style.sex} ${this.sexClass[upUser.sex]}`} />
              {upUser.level ? (<img src={require(`../../assets/images/lv${upUser.level}.png`)} />) : null}
            <span className={style.uid}>UID:{upUser.mId}</span>
          </div>
          <div className={style.detail}>
            <div className={style.stats}>
              <span className={style.follow}>
                {
                  upUser.following !== undefined ? formatTenThousand(upUser.following) : "--"
                }&nbsp;
              </span>
              关注
              <span className={style.fans}>
                {
                  upUser.follower !== undefined ? formatTenThousand(upUser.follower) : "--"
                }&nbsp;
                </span>
              粉丝
            </div>
            <div className={style.introduce} ref={this.introduceRef}>
              <i className={`icon-arrow-down ${style.arrow}`} ref={this.arrowRef}
                onClick={this.toggle} />
              <div className={style.content} ref={this.contentRef}>
                {upUser.sign}
              </div>
            </div>
          </div>
        </div>
        {/* up主投稿 */}
        <div className={style.masterpiece}>
          <div className={style.title}>Ta的投稿</div>
          <div className={style.videoList}>
            {
              this.state.videos.map((video) => (
              <div className={style.videoWrapper} key={video.aId}>
                <a href={"/video/av" + video.aId}>
                  <div className={style.imageContainer}>
                    <LazyLoad height="10.575rem">
                      <img src={this.getPicUrl("https:" + video.pic, "@200w_125h")} alt={video.title} />
                    </LazyLoad>
                    <div className={style.duration}>{video.duration}</div>
                  </div>
                  <div className={style.infoWrapper}>
                    <div className={style.infoTitle}>
                      {video.title}
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
          {
            this.state.videos.length > 0 && this.state.showLoadMore === true ? (
              <div className={style.loadMore} onClick={() => {this.loadMoreVideos()}}>
                刚刚看到这里，点击加载更多~
              </div>
            ) : null
          }
          {
            this.state.loading === true ? (
              <div className={style.loading}>
                加载中...
              </div>
            ) : null
          }
          {
            this.state.loading === false && this.state.videos.length === 0 ? (
              <div className={style.tips}>
                <img src={tips} />
                <span className={style.text}>Ta还没有投过稿~</span>
              </div>
            ) : null
          }
        </div>
        <ScrollToTop />
      </div>
    );
  }
}

UpUser.contextType = Context;

export default UpUser;
