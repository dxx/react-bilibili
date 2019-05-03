import * as React from "react";
import { match } from "react-router-dom";
import { Helmet } from "react-helmet";
import LazyLoad, { forceCheck } from "react-lazyload";
import TabBar from "../../components/tab-bar/TabBar";
import ScrollToTop from "../../components/scroll-to-top/ScrollToTop";
import Context from "../../context";
import { PartitionType, Video } from "../../models";
import { formatTenThousand } from "../../util/string";
import { setShouldLoad } from "../../redux/actions";
import { getRankingVideoList, getVideoList} from "../../redux/async-actions/ranking";
import { getPicSuffix } from "../../util/image";

import back from "../../assets/images/back.png";
import style from "./ranking.styl?css-modules";

interface RankingProps {
  shouldLoad: boolean;
  rankingPartitions: PartitionType[];
  rankingVideos: Video[];
  match: match<{rId}>;
  dispatch: (action: any) => Promise<void>;
  staticContext?: { picSuffix: string };
}

interface RankingState {
  currentTabIndex: number;
  loading: boolean;
}

class Ranking extends React.Component<RankingProps, RankingState> {
  constructor(props) {
    super(props);

    const { shouldLoad, rankingPartitions, match: m} = props;

    const currentTabIndex = rankingPartitions.findIndex((parittion) =>
      parittion.id === parseInt(m.params.rId, 10)
    );

    this.state = {
      currentTabIndex,
      loading: shouldLoad
    }
  }
  public getSnapshotBeforeUpdate() {
    return document.documentElement.scrollTop || document.body.scrollTop > 0 ? true : false;
  }
  public componentDidUpdate(prevProps, prevState, scroll) {
    // 窗口发生滚动，滚动最顶端
    if (scroll === true) {
      window.scrollTo(0, 0);
    }
  }
  public componentDidMount() {
    if (this.props.shouldLoad === true) {
      // 从客户端跳转，应该加载数据
      this.props.dispatch(getRankingVideoList(this.props.match.params.rId))
      .then(() => {
        const currentTabIndex = this.props.rankingPartitions.findIndex((parittion) =>
          parittion.id === parseInt(this.props.match.params.rId, 10)
        );
        this.setState({
          currentTabIndex,
          loading: false
        });
      });
    } else {
      this.props.dispatch(setShouldLoad(true));
    }
    setTimeout(() => {
      forceCheck();
    }, 10);
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
  public handleClick = (tab) => {
    const currentTabIndex = this.props.rankingPartitions.findIndex((parittion) =>
      parittion.id === parseInt(tab.id, 10)
    );
    this.setState({
      currentTabIndex,
      loading: true
    });
    this.props.dispatch(getVideoList(tab.id)).then(() => {
      this.setState({
        loading: false
      });
    });
  }
  public render() {
    const { rankingPartitions, rankingVideos, match: m } = this.props;
    const currentPartition = rankingPartitions[this.state.currentTabIndex];
    return (
      <div className="ranking">
        {
          currentPartition ? (
            <Helmet>
              <title>{currentPartition.name + "-排行榜"}</title>
            </Helmet>
          ) : null
        }
        <div className={style.topWrapper}>
          <div className={style.header}>
            <span onClick={() => { window.history.back(); }}>
              <img src={back} />
            </span>
            <span>排行榜</span>
          </div>
          <TabBar data={rankingPartitions} type={"indicate"} currentIndex={this.state.currentTabIndex}
            onClick={this.handleClick}/>
        </div>
        <div className={style.topBottom} />
        <div className={style.rankingList}>
          {
            rankingVideos.map((video, i) => (
              <div className={style.videoWrapper} key={i}>
                <a href={"/video/av" + video.aId}>
                  <div className={style.ranking}>
                  {
                    i < 3 ? (
                      <img src={require(`../../assets/images/rank${i + 1}.png`)} />
                    ) : i + 1
                  }
                  </div>
                  <div className={style.info}>
                    <div className={style.imageContainer}>
                      <LazyLoad height={"5.875rem"}>
                        <img src={this.getPicUrl(video.pic, "@200w_125h")} alt={video.title} />
                      </LazyLoad>
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
                  </div>
                </a>
              </div>
            ))
          }
        </div>
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

Ranking.contextType = Context;

export default Ranking;
