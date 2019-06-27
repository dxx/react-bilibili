import * as React from "react";
import { withRouter } from "react-router-dom";
import VideoItem from "../../components/video-item/VideoItem";

import style from "./partition.styl?css-modules";

const Partition = (props) => {
  const { data, history, getPicUrl }  = props;
  return (
    <div className={style.partition}>
      <div className={style.title}>{data.name}</div>
      <div className={style.ranking}>
        <span className={style.more}
          onClick={() => {history.push({pathname: "/channel/" + data.id})}}>
          查看更多
        </span>
        <i className={`${style.iconRight} icon-arrow-right`} />
      </div>
      <div className={style.partitionContent  + " clear"}>
        {
          data.videos.map((item, i) => {
            if (item.pic && item.pic.indexOf("@320w_200h") === -1) {
              item.pic = getPicUrl(item.pic, "@320w_200h");
            }
            return <VideoItem video={item} key={i} showStatistics={true} />
          })
        }
      </div>
    </div>
  );
}

export default withRouter(Partition);
