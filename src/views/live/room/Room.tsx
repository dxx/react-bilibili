import * as React from "react";
import { Helmet } from "react-helmet";
import Context from "../../../context";
import { getUserInfo } from "../../../api/up-user";
import { getDanMuConfig } from "../../../api/live";
import { Live, UpUser } from "../../../models";
import { formatTenThousand } from "../../../util/string";
import VideoPlayer from "../../video/VideoPlayer";
import Tab, { sendMsg } from "./Tab";
import ChatWebSocket, { Events } from "./ChatWS";

import style from "./room.styl?css-modules";

interface RoomProps {
  roomData: {
    parentAreaId: number,
    parentAreaName: string,
    areaId: number,
    areaName: string,
    uId: number,
    description: string,
    liveTime: string,
    live: Live;
  }
}

const {
  useState,
  useEffect,
  useRef
} = React;

function Room(props: RoomProps) {
  const { roomData } = props;
  const { live } = roomData;

  const [anchor, setAnchor] = useState(new UpUser(0, "", ""));
  const onlineNumRef: React.Ref<HTMLSpanElement> = useRef(null);
  const videoPlayerRef: React.Ref<VideoPlayer> = useRef(null);

  useEffect(() => {

    getUserInfo(roomData.uId).then((result) => {
      if (result.code === "1") {
        const data = result.data;
        const upUser = new UpUser(
          data.upUserInfo.mid,
          data.upUserInfo.name,
          data.upUserInfo.face,
          data.upUserInfo.level,
          data.upUserInfo.sex,
          data.upUserInfo.sign,
          data.status.following,
          data.status.follower
        );
        setAnchor(upUser);
      }
    });

    getDanMuConfig(live.roomId).then((result) => {
      if (result.code === "1") {
        const url = `wss://${result.data.host}/sub`;
        const chatWebSocket = new ChatWebSocket(url, live.roomId);

        chatWebSocket.on(Events.HEARTBEAT_REPLY, ({onlineNum}) => {
          onlineNumRef.current.innerHTML = `人气：${formatTenThousand(onlineNum)}`;
        });

        chatWebSocket.on(Events.MESSAGE_RECEIVE, (data) => {
          data.forEach(function(item) {
            sendMsg(item);
            if (item.cmd === "DANMU_MSG") {
              const barragData = {
                color: "#" +Number(item.info[0][3]).toString(16),
                content: item.info[1]
              };
              // 发送弹幕
              videoPlayerRef.current.sendBarrage(barragData);
            }
          });
        });
      }
    });

  }, []);

  return (
    <div className="live-room">
      <Helmet>
        <title>{live.title}</title>
      </Helmet>
      <header className={style.header}>
        <a href="/live"><i /></a>
        <div className={style.crumb}>
          <a href="/live/areas">直播分类</a>
          <span>&nbsp;&gt;&nbsp;</span>
          <a href={`/live/list?parent_area_id=${roomData.parentAreaId}` +
            `&parent_area_name=${roomData.parentAreaName}` +
            `&area_id=${roomData.areaId}` +
            `&area_name=${roomData.areaName}`}>
            { roomData.areaName }
          </a>
        </div>
      </header>
      <Context.Consumer>
        { context => (
          <section className={style.main}>
            <div className={style.liveContainer}>
              <VideoPlayer 
                live={true} isLive={live.isLive === 1}
                liveTime={new Date(roomData.liveTime.replace(/-/g, "/")).getTime()}
                video={{
                  aId: 0,
                  cId: 0,
                  title: live.title,
                  cover: context.picURL + "?pic=" + live.cover,
                  duration: 0,
                  url: live.playUrl
                }}
                ref={videoPlayerRef} />
            </div>
            <div className={style.upContainer}>
              <div className={style.face}>
                <a href={"/space/" + roomData.uId}>
                  {
                    anchor.face ? (
                      <img src={context.picURL + "?pic=" + anchor.face} alt={anchor.name} />
                    ) : null
                  }
                </a>
              </div>
              <div className={style.infoWrapper}>
                <p className={style.anchor}>主播：<span>{anchor.name}</span></p>
                <p className={style.count}>
                  <span className={style.online} ref={onlineNumRef}>
                    人气：{formatTenThousand(live.onlineNum)}
                  </span>
                  <span className={style.fans}>粉丝：{formatTenThousand(anchor.follower)}</span>
                </p>
              </div>
            </div>
            <div className={style.tabContainer}>
              <Tab description={roomData.description} />
            </div>
          </section>
        )}
      </Context.Consumer>
    </div>
  );
}

export default Room;
