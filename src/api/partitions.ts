import { getJSON } from "./fetch";
import { URL_PARTITION, URL_RANKING_PARTITION } from "./url";

/**
 * 获取分类
 */
export function getPartitions() {
  return getJSON(URL_PARTITION, null);
}

/**
 * 获取排行榜分类
 */
export function getRankingPartitions() {
  return getJSON(URL_RANKING_PARTITION, null);
}
