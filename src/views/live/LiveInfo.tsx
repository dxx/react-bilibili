import * as React from "react";
import LazyLoad from "react-lazyload";
import { Live } from "../../models";
import { formatTenThousand } from "../../util/string";

import style from "./live-info.styl?css-modules";

interface LiveInfoProps {
  data: Live;
}

function LiveInfo(props: LiveInfoProps) {
  const { data } = props;
  return (
    <div className={style.liveInfo}>
      <div className={style.coverWrapper}>
        <div className={style.cover}>
          <LazyLoad height={"100%"} offset={100}>
            <img src={data.cover} alt={data.title} onLoad={(e) => {
              (e.currentTarget.parentNode as HTMLImageElement).style.opacity = "1";
            }}/>
          </LazyLoad>
        </div>
        <span className={style.name}>{data.upUser.name}</span>
        <span className={style.online}>{formatTenThousand(data.onlineNum)}</span>
      </div>
      <div className={style.title}>{data.title}</div>
    </div>
  );
}

export default LiveInfo;
