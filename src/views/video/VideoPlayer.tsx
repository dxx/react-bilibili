import * as React from "react";
import * as Hls from "hls.js";
import Context from "../../context";
import Barrage, { BarrageType } from "./Barrage";
import { formatDuration } from "../../util/string";
import { getBarrages } from "../../api/video";

import loading from "../../assets/images/loading.svg";
import style from "./video-player.styl?css-modules";

interface VideoPlayerProps {
  live: boolean;
  isLive?: boolean;
  liveTime?: number;
  video: {
    aId: number,
    cId: number,
    title: string,
    cover: string,
    duration: number,
    url: string
  };
}

interface VideoPlayerState {
  duration: number;
  paused: boolean;
  waiting: boolean;
  barrageSwitch: boolean;
  fullscreen: boolean;
  finish: boolean;
  isShowCover: boolean;
  isShowControlBar: boolean;
  isShowPlayBtn: boolean;
  isLive: boolean;
}

class VideoPlayer extends React.PureComponent<VideoPlayerProps, VideoPlayerState> {
  private barrageRef: React.RefObject<Barrage>;
  private videoRef: React.RefObject<HTMLVideoElement>;
  private currentTimeRef: React.RefObject<HTMLSpanElement>;
  private progressRef: React.RefObject<HTMLDivElement>;
  private liveDurationRef: React.RefObject<HTMLDivElement>;
  private initBarrages: any = [];
  private barrages: any = [];
  public static defaultProps = {
    live: false,
    isLive: false,
    liveTime: 0
  };
  constructor(props) {
    super(props);

    this.videoRef = React.createRef();
    // 弹幕ref
    this.barrageRef = React.createRef();
    // 当前播放时间ref
    this.currentTimeRef = React.createRef();
    // 播放进度ref
    this.progressRef = React.createRef();
    // 直播时长ref
    this.liveDurationRef = React.createRef();

    this.state = {
      duration: 0,
      paused: true,
      waiting: false,
      barrageSwitch: true,
      fullscreen: false,
      finish: false,
      isShowCover: true,
      isShowControlBar: false,
      isShowPlayBtn: false,
      isLive: props.isLive
    };
  }
  public componentDidMount() {
    this.initVideo();
  }
  /**
   * 发射弹幕
   */
  public sendBarrage(data: {color: string, content: string}) {
    if (this.state.barrageSwitch === true) {
      this.barrageRef.current.send({
        type: BarrageType.RANDOM,
        color: data.color,
        content: data.content
      });
    }
  }
  private initVideo() {
    const { live, video } = this.props; 
    const barrageComponent = this.barrageRef.current;
    const videoDOM = this.videoRef.current;
    const currentTimeDOM = this.currentTimeRef.current;
    const progressDOM = this.progressRef.current;

    const play = () => {
      this.setState({
        isShowCover: false,
        paused: false,
        waiting: false
      });
    }

    // 调用play方法时触发
    videoDOM.addEventListener("play", play);

    // 暂停或者在缓冲后准备重新开始播放时触发
    videoDOM.addEventListener("playing", play);

    videoDOM.addEventListener("waiting", () => {
      this.setState({
        waiting: true
      });
    });

    // 非直播时处理
    if (live === false) {
      this.getBarrages();

      videoDOM.addEventListener("timeupdate", () => {
        if (this.state.duration === 0) {
          this.setState({
            duration: videoDOM.duration
          });
        }
        currentTimeDOM.innerHTML = formatDuration(videoDOM.currentTime, "0#:##");
        const progress = videoDOM.currentTime / videoDOM.duration * 100;
        progressDOM.style.width = `${progress}%`;
  
        if (this.state.barrageSwitch === true) {
          const barrages = this.findBarrages(videoDOM.currentTime);
          barrages.forEach((barrage) => {
            // 发送弹幕
            barrageComponent.send(barrage);
          });
        }
      });
  
      videoDOM.addEventListener("ended", () => {
        currentTimeDOM.innerHTML = "00:00";
        progressDOM.style.width = "0";
        this.setState({
          paused: true,
          isShowControlBar: false,
          isShowPlayBtn: false,
          fullscreen: false,
          finish: true
        });
  
        // 重新赋值弹幕列表
        this.barrages = this.initBarrages.slice();
        // 清除弹幕
        barrageComponent.clear();
      });

      /**
       * 进度条事件
       */
      // 总进度条宽度
      let width = 0;
      // 距离屏幕左边距离
      let left = 0;
      // 拖拽进度比例
      let rate = 0;
      progressDOM.addEventListener("touchstart", (e) => {
        e.stopPropagation();

        const progressWrapperDOM = progressDOM.parentElement;
        width = progressWrapperDOM.offsetWidth;
        left = progressWrapperDOM.getBoundingClientRect().left;

        this.playOrPause();
      });
      progressDOM.addEventListener("touchmove", (e) => {
        e.preventDefault();

        const touch = e.touches[0];
        // 计算拖拽进度比例
        rate = (touch.clientX - left) / width;
        if (rate > 1) {
          rate = 1;
        } else if (rate < 0) {
          rate = 0;
        }
        const currentTime = videoDOM.duration * rate;
        progressDOM.style.width = `${rate * 100}%`;
        currentTimeDOM.innerHTML = formatDuration(currentTime, "0#:##");
      });
      progressDOM.addEventListener("touchend", () => {
        videoDOM.currentTime = videoDOM.duration * rate;

        this.playOrPause();
      });   
    } else { // 直播时处理
      if (this.props.liveTime) {
        const liveDurationDOM = this.liveDurationRef.current;
        let liveDuration = (new Date().getTime() -  this.props.liveTime) / 1000;
        liveDurationDOM.innerHTML = formatDuration(liveDuration, "0#:##:##");
        setInterval(() => {
          liveDuration += 1;
          liveDurationDOM.innerHTML = formatDuration(liveDuration, "0#:##:##");
        }, 1000);
      }

      // 支持m3u8，直接使用video播放
      if (videoDOM.canPlayType("application/vnd.apple.mpegurl")) {
        videoDOM.src = video.url;
        videoDOM.addEventListener("canplay", () => {
          videoDOM.play();
        });
        videoDOM.addEventListener("error", () => {
          this.setState({
            isLive: false
          });
        });
      } else if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(video.url);
        hls.attachMedia(videoDOM);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoDOM.play();
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR ||
              data.response.code === 404) {
              this.setState({
                isLive: false
              });
            }
          }
        });
      }
    }
  }
  /**
   * 获取弹幕列表
   */
  private getBarrages() {
    getBarrages(this.props.video.cId)
      .then((result) => {
        const barrages = [];
        if (result.code === "1") {
          result.data.forEach((data) => {
            barrages.push({
              type: data.type === "1" ? BarrageType.RANDOM : BarrageType.FIXED,
              color: "#" + Number(data.decimalColor).toString(16),
              content: data.content,
              time: Number(data.time)
            });
          });
        }
        // 初始化弹幕列表
        this.initBarrages = barrages;
        this.barrages = this.initBarrages.slice();
      });
  }
  /**
   * 根据时间查找弹幕
   */
  private findBarrages(time) {
    // 查找到的弹幕
    const barrages = [];
    // 查找到的弹幕索引
    const indexs = [];
    this.barrages.forEach((barrage, index) => {
      // 换成整数秒
      if (parseInt(barrage.time, 10) === parseInt(time, 10)) {
        barrages.push(barrage);
        indexs.push(index);
      }
    });
    indexs.forEach((index, i) => {
      // 删除掉已经查找到的弹幕
      this.barrages.splice(index - i, 1);
    });
    return barrages;
  }
  /**
   * 播放或暂停
   */
  private playOrPause() {
    const videoDOM = this.videoRef.current;
    if (this.state.paused === true) {
      videoDOM.play();

      this.setState({
        paused: false,
        isShowPlayBtn: true,
        finish: false
      });

      // 3秒后播放按钮显示如果显示则隐藏
      setTimeout(() => {
        if (this.state.isShowPlayBtn === true) {
          this.setState({
            isShowControlBar: false,
            isShowPlayBtn: false
          });
        }
      }, 3000);
    } else {
      videoDOM.pause();

      this.setState({
        paused: true
      });
    }
  }
  /**
   * 显示或隐藏控制器
   */
  private showOrHideControls() {
    if (this.state.isShowControlBar === true) {
      this.setState({
        isShowControlBar: false,
        isShowPlayBtn: false
      });
    } else {
      this.setState({
        isShowControlBar: true,
        isShowPlayBtn: true
      });
    }
  }
  /**
   * 改变播放位置
   */
  private changePlayPosition(e) {
    e.stopPropagation();
    const progressWrapperDOM = e.currentTarget;
    const left = progressWrapperDOM.getBoundingClientRect().left;
    const progress = (e.clientX - left) / progressWrapperDOM.offsetWidth;
    const videoDOM = this.videoRef.current;
    videoDOM.currentTime = videoDOM.duration * progress;
    videoDOM.play();

    this.setState({
      isShowControlBar: false
    });

    setTimeout(() => {
      if (this.state.isShowPlayBtn === true) {
        this.setState({
          isShowPlayBtn: false
        });
      }
    }, 3000);

    // 重新赋值弹幕列表
    this.barrages = this.initBarrages.slice();
    // 清除弹幕
    this.barrageRef.current.clear();
  }
  /**
   * 开启或关闭弹幕
   */
  private onOrOff() {
    if (this.state.barrageSwitch === true) {
      this.barrageRef.current.clear();
      this.setState({
        barrageSwitch: false
      });
    } else {
      this.setState({
        barrageSwitch: true
      });
    }
  }
  /**
   * 进入或退出全屏
   */
  private entryOrExitFullscreen() {
    if (this.state.fullscreen === true) {
      this.setState({
        isShowControlBar: false,
        isShowPlayBtn: false,
        fullscreen: false
      });
    } else {
      this.setState({
        isShowControlBar: false,
        isShowPlayBtn: false,
        fullscreen: true
      });
    }
  }
  private getVideoUrl(url) {
    const { videoURL } = this.context;
    // 拼接播放源地址
    return `${videoURL}?video=https:${encodeURIComponent(url)}`;
  }
  public render() {
    const { live, video } = this.props;
    const videoStyle = { display: this.state.isShowCover === true ? "none" : "block" };
    const coverStyle = { display: this.state.isShowCover === true ? "block" : "none" };
    const controlBarStyle = { display: this.state.isShowControlBar === true ? "block" : "none" };
    const playBtnStyle = { display: this.state.isShowPlayBtn === true ? "block" : "none" };
    const playBtnClass = this.state.paused === true ? style.play : style.pause;
    const switchClass = this.state.barrageSwitch === true ? style.barrageOn : style.barrageOff;
    const wrapperClass = this.state.fullscreen === true ?
      `${style.videoPlayer} ${style.fullscreen}` : style.videoPlayer;
    return (
      <div className={wrapperClass}>
        <video height="100%" width="100%" preload="auto"
          x5-playsinline="true"
          webkit-playsinline="true"
          playsInline={true}
          src={live === false ? this.getVideoUrl(video.url) : ""}
          style={videoStyle}
          ref={this.videoRef} />
        <div className={style.barrage}>
          <Barrage opacity={live === false ? 0.75 : 1} ref={this.barrageRef} />
        </div>
        <div className={style.controls} onClick={() => { this.showOrHideControls(); }}>
          <div className={style.playButton + " " + playBtnClass} style={playBtnStyle}
            onClick={(e) => { e.stopPropagation(); this.playOrPause(); }} />
          <div className={style.controlBar + (live === true ? " " + style.liveControl : "")}
            style={controlBarStyle}>
            {
              live === false ? (
                <React.Fragment>
                  <div className={style.left}>
                    <span className={style.time} ref={this.currentTimeRef}>00:00</span>
                    <span className={style.split}>/</span>
                    <span className={style.totalDuration}>{formatDuration(this.state.duration, "0#:##")}</span>
                  </div>
                  <div className={style.center}>
                    <div className={style.progressWrapper} onClick={(e) => { this.changePlayPosition(e); }}>
                      <div className={style.progress} ref={this.progressRef} />
                    </div>
                  </div>
                </React.Fragment>
              ) : (
                <div className={style.left} ref={this.liveDurationRef}></div>
              )
            }
            <div className={style.right}>
               <div className={switchClass}
                 onClick={(e) => { e.stopPropagation(); this.onOrOff(); }} />
               <div className={style.fullscreen}
                 onClick={(e) => { e.stopPropagation(); this.entryOrExitFullscreen(); }}/>
            </div>
          </div>
        </div>
        <div className={style.cover} style={coverStyle}>
          { 
            live === false ? (
              <React.Fragment>
                <div className={style.title}>
                  av{video.aId}
                </div>
                <img className={style.pic} src={video.cover} alt={video.title} />
                <div className={style.prePlay}>
                  <div className={style.duration}>{formatDuration(video.duration, "0#:##:##")}</div>
                  <div className={style.preview} onClick={() => { this.playOrPause(); }} />
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <img className={style.pic} src={video.cover} alt={video.title} />
                <div className={style.prePlay}>
                  <div className={style.preview} onClick={() => { this.playOrPause(); }} />
                </div>
              </React.Fragment>
            )
          }
        </div>
        {
          this.state.waiting === true ? (
            <div className={style.loading}>
              <div className={style.wrapper}>
                <img className={style.img} src={loading} />
                <span className={style.text}>
                  { live === false ? "正在缓冲" : "" }
                </span>
              </div>
            </div>
          ) : null
        }
        {
          this.state.finish === true ? (
            <div className={style.finishCover}>
              <img className={style.coverPic} src={video.cover} alt={video.title} />
              <div className={style.coverWrapper}>
                <div className={style.replay} onClick={() => { this.playOrPause(); }}>
                  <i className={style.replayIcon}/>
                  <span>重新播放</span>
                </div>
              </div>
            </div>
          ) : null
        }
        {
          live === true && this.state.isLive == false ? (
            <div className={style.noticeCover}>
              <div className={style.noticeWrapper}>
                <i />
                <span>闲置中...</span>
              </div>
            </div>
          ) : null
        }
      </div>
    );
  }
}

VideoPlayer.contextType = Context;

export default VideoPlayer;
