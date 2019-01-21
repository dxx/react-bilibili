import * as React from "react";
import LazyLoad from "react-lazyload";
import { Video } from "../../models";
import { formatTenThousand } from "../../util/string";

import tv from "../../assets/images/tv.png";
import style from "./video-item.styl?css-modules";

interface VideoItemProps {
  video: Video;
  showStatistics: boolean;
}

const VideoItem = (props: VideoItemProps) => {
  const { video, showStatistics } =  props;
  return (
    <div className={style.video}>
      <a className={style.videoLink} href={"/video/av" + video.aId}>
        <div className={style.imageContainer}>
          <img src={tv} className={style.tv} />
          {
            video.pic ? (
              <LazyLoad height={"5.3rem"} offset={100}>
                <img src={video.pic} className={style.pic}
                alt={video.title} />
              </LazyLoad>
            ) : null
          }
          <div className={style.cover} />
          {
            showStatistics === true ? (
              <div className={style.info}>
                <span className={`${style.playIcon} icon-play-count`} />
                <span className={style.playCount}>
                  {
                    video.playCount ? formatTenThousand(video.playCount) : "--"
                  }
                </span>
                <span className={`${style.barrageIcon} icon-barrage-count`} />
                <span className={style.barrageCount}>
                  {
                    video.barrageCount ? formatTenThousand(video.barrageCount) : "--"
                  }
                </span>
              </div>
            ) : null
          }
        </div>
        <div className={style.title}>
          {video.title}
        </div>
      </a>
    </div>
  );
}

export default VideoItem;
