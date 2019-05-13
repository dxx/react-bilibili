import * as React from "react";
import { getRoomGifts } from "../../../api/live";

import style from "./tab.styl?css-modules";

interface TabProps {
  description: string;
}

const {
  useState,
  useEffect,
  useRef
} = React;

let chatDOM: HTMLDivElement = null;
let gifts: Array<any> = [];

/**
 * 发送聊天消息
 */
const sendMsg = (msg) => {
  /* eslint-disable */
  if (!chatDOM) {
    return;
  }
  const div = document.createElement("div");
  div.className = style.chatMsg;
  switch(msg.cmd) {
    case "DANMU_MSG":
      // console.log(`${msg.info[2][1]}: ${msg.info[1]}`);
      const manager = msg.info[2][2] === 1 ? `<span class="${style.msgManager}">房管</span>`: "";
      div.innerHTML = `${manager}<span class="${style.msgName}">${msg.info[2][1]}: </span>` +
        `${msg.info[1]}`;
      break;
    case "SEND_GIFT":
      // console.log(`${msg.data.uname} ${msg.data.action} ${msg.data.num} 个 ${msg.data.giftName}`);
      div.classList.add(style.gift);
      const gift = gifts.find((gift) => gift.id === msg.data.giftId);
      div.innerHTML = `<span class="${style.msgName}">${msg.data.uname} </span>` +
        `${msg.data.action}${msg.data.giftName} <img src="${gift.img}"` +
        `style="width: 1rem; vertical-align: middle" /> x ${msg.data.num}`;
      break;
    case "WELCOME":
      // console.log(`${msg.data.uname} 进入直播间`);
      const isSvip = msg.data.svip ? true : false;
      isSvip ? div.classList.add(style.svip) : div.classList.add(style.vip);
      const call = isSvip ? "年费老爷" : "老爷";
      div.innerHTML = `<span class="${style.msgName}">${msg.data.uname} ${call} </span>` +
        `进入直播间`;
      break;
    // 其它通知类型
    default:
      console.log(msg);
  }
  // 延时执行，避免并发造成dom计算不准确
  setTimeout(() => {
    let needScroll = true;
    // 判断是否滚动到最底部
    if (chatDOM.scrollTop <
      chatDOM.scrollHeight - chatDOM.clientHeight) {
      needScroll = false;
    }
    chatDOM.appendChild(div);
    // 如果滚动到底部，添加消息后，继续滚动到底部
    if (needScroll) {
      chatDOM.scrollTop = chatDOM.scrollHeight - chatDOM.clientHeight;
    }
  }, 100);
}

function Tab(props: TabProps) {
  const { description } = props;
  const [index, setIndex] = useState(0);

  const chatRef: React.RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {

    chatDOM = chatRef.current;

    // 消息超过1000条，进行清理
    setInterval(() => {
      const children = chatDOM.children;
      if (children.length > 1000) {
        const subChildren = Array.from(children).slice(0, children.length - 1000);
        subChildren.forEach((child) => {
          chatDOM.removeChild(child);
        });
      }
    }, 5000);

    getRoomGifts().then((result) => {
      if (result.code === "1") {
        gifts = result.data;
      }
    });

  }, []);

  return (
    <div className={style.tabWrapper}>
      <div className={style.tabItemWrapper}>
        <div className={style.tabItem + (index === 0 ? " " + style.active : "")}
          onClick={() => {
            setIndex(0);
          }}>互动</div>
        <div className={style.tabItem + (index === 1 ? " " + style.active : "")}
          onClick={() => {
            setIndex(1);
          }}>简介</div>
      </div>
      <div className={style.tabContentWrapper}>
        {/* 互动 */}
        <div className={style.tabContent} style={{display: (index === 0 ? "block" : "none")}}>
          <div className={style.chatContainer} ref={chatRef}>
            {/* <div className={style.chatMsg}>
              <span className={style.msgManager}>房管</span>
              <span className={style.msgName}>你残留下的光与影: </span>
              ブラのサイズは？
            </div>
            <div className={style.chatMsg}>
              <span className={style.msgName}>你残留下的光与影: </span>
              ブラのサイズは？
            </div>
            <div className={style.chatMsg + " " + style.svip}>
              <span className={style.msgName}>百杜Paido 年费老爷 </span>
              进入直播间
            </div>
            <div className={style.chatMsg + " " + style.vip}>
              <span className={style.msgName}>哈喽 老爷 </span>
              进入直播间
            </div>
            <div className={style.chatMsg + " " + style.gift}>
              <span className={style.msgName}>Mus_铭然 </span>
              赠送亿圆 <img src="https://s1.hdslb.com/bfs/live/d57afb7c5596359970eb430655c6aef501a268ab.png"
                    style={{width: "1rem", verticalAlign: "middle"}} /> x 1
            </div> */}
          </div>
        </div>
        {/* 简介 */}
        <div className={style.tabContent} style={{display: (index === 1 ? "block" : "none")}}>
          <div className={style.desc} dangerouslySetInnerHTML={{__html: description}}></div>
        </div>
      </div>
    </div>
  );
}

export default Tab;

export { sendMsg };
