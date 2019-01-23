import { getJSON } from "./fetch";
import {
  URL_VIDEO_DETAIL,
  URL_VIDEO_RECOMMEND,
  URL_VIDEO_REPLAY,
  URL_VIDEO_BARRAG
} from "./url";

/**
 * 获取视频信息
 */
export function getVideoInfo(aId: number) {
  return getJSON(URL_VIDEO_DETAIL + `/${aId}`, null);
}

/**
 * 获取推荐视频列表
 */
export function getRecommendVides(aId: number) {
  return getJSON(URL_VIDEO_RECOMMEND + `/${aId}`, null);
}

/**
 * 获取评论列表
 */
export function getComments(aId: number, p: number) {
  return getJSON(URL_VIDEO_REPLAY, {aId, p});
}

/**
 * 获取弹幕
 */
export function getBarrages(cId: number) {
  return getJSON(URL_VIDEO_BARRAG + `/${cId}`, null)
}
