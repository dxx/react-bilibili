import * as React from "react";
import VideoItem from "../../components/video-item/VideoItem";
import { Video, createVideoByLatest } from "../../models";
import { getRankingArchive } from "../../api/ranking";

import tips from "../../assets/images/tips.png";
import style from "./video-latest.styl?css-modules";

interface VideoLatestProps {
  id: number;
  getPicUrl: (url: string, format: string) => string;
}

interface VideoLatestState {
  currentPage: number;
  latestVideos: Video[];
  loading: boolean;
}

class VideoLatest extends React.Component<VideoLatestProps, VideoLatestState> {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: 1,
      latestVideos: [],
      loading: false
    }
  }
  public static getDerivedStateFromProps(props, state) {
    if (props.id !== state.id) {
      // 组件render前，如果id变更清除数据
      return {
        id: props.id,
        latestVideos: []
      };
    }
    return null;
  }
  public componentDidUpdate(prevProps, prevState) {
    if (this.props.id !== prevProps.id) {
      this.loadLatestData(this.props.id, 1);
    }
  }
  public componentDidMount() {
    this.loadLatestData(this.props.id, 1);
  }
  private loadLatestData(id, p) {
    this.setState({
      loading: true
    });
    getRankingArchive({tId: id, p}).then((result) => {
      if (result.code === "1") {
        const latestVideos = result.data.archives.map((data) => createVideoByLatest(data));
        this.setState({
          currentPage: p,
          latestVideos: this.state.latestVideos.concat(latestVideos),
          loading: false
        });
      }
    });
  }
  private handleClick() {
    const currentPage = this.state.currentPage + 1;
    if (currentPage <= 4) {
      this.loadLatestData(this.props.id, currentPage);
    }
  }
  public render() {
    /* const data = [];
    for (let i = 0; i < 4; i++) {
      data.push(new Video(0, "茶理理一人成团！用四种声线翻唱POP/STARS【英雄联盟K/DA全球热单】", "", "", 111111, 111111, 0, 0, 0));
    } */
    return (
      <div className={style.videoLatest}>
        <div className={style.title}>最新视频</div>
          <div className={style.videoList + " clear"}>
            {
              this.state.latestVideos.map((item, i) => {
                if (item.pic && item.pic.indexOf("@320w_@200h") === -1) {
                  item.pic = this.props.getPicUrl(item.pic, "@320w_@200h");
                }
                return <VideoItem video={item} key={i} showStatistics={true} />
              })
            }
          </div>
          {
            this.state.currentPage < 4 ? (
              this.state.loading === false ? (
                <div className={style.loadMore} onClick={() => {this.handleClick()}}>
                  点击加载更多
                </div>
              ) : (
                <div className={style.loading}>
                  加载中...
                </div>
              )
            ) : (
              <div className={style.tips}>
                <img src={tips} />
                <span className={style.text}>只能到这里了 ~</span>
              </div>
            )
          }
          {/*<div className={style.videoLatest}>
            <div className={style.title}>最新视频</div>
            <div className={style.videoList}>
              {
                data.map((item, i) => (
                  <VideoItem video={item} key={i} showStatistics={true} />
                ))
              }
            </div>
            <div className={style.loadMore}>
              点击加载更多
            </div>
            <div className={style.tips}>
              <img src={require("../../assets/images/tips.png")}/>
              <span className={style.text}>只能到这里了 ~</span>
            </div>
            </div>*/}
      </div>
    );
  }
}

export default VideoLatest;
