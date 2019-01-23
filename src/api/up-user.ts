import { getJSON } from "./fetch";
import { URL_UP_USER, URL_USER_VIDEO } from "./url";

/**
 * 获取up主信息
 */
export function getUserInfo(mId: number) {
  return getJSON(URL_UP_USER + `/${mId}`, null);
}

/**
 * 获取up主投稿视频
 */
export function getUserVideos(aId: number, p: number, size: number) {
  return getJSON(URL_USER_VIDEO, {uId: aId, p, size});
}
