import { getJSON } from "./fetch";
import { 
  URL_LIVE_AREA,
  URL_LIVE_DATA,
  URL_LIVE_LIST,
  URL_LIVE_ROOM_INFO,
  URL_LIVE_ROOM_GIFT,
  URL_LIVE_PLAY_URL,
  URL_LIVE_DANMU_CONFIG
} from "./url";

// 获取直播分区
export function getAreas() {
  return getJSON(URL_LIVE_AREA, null);
}

// 获取直播首页数据
export function getLiveIndexData() {
  return getJSON(URL_LIVE_DATA, null);
}

// 获取直播房间列表数据
export function getLiveListData(param) {
  return getJSON(URL_LIVE_LIST, param);
}

// 获取直播间数据
export function getRoomInfo(roomId: number){
  return getJSON(URL_LIVE_ROOM_INFO, {roomId});
}

// 获取礼物
export function getRoomGifts(){
  return getJSON(URL_LIVE_ROOM_GIFT, null);
}

// 获取直播地址
export function getPlayUrl(roomId: number){
  return getJSON(URL_LIVE_PLAY_URL, {roomId});
}

// 获取弹幕配置
export function getDanMuConfig(roomId: number){
  return getJSON(URL_LIVE_DANMU_CONFIG, {roomId});
}
