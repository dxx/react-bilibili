import { getJSON } from "./fetch";
import { URL_RANKING, URL_RANKING_REGION, URL_RANKING_ARCHIVE } from "./url";

// 获取排行榜
export function getRankings(rId) {
  return getJSON(URL_RANKING + `/${rId}`, null);
}

// 获取分类排行
export function getRankingRegion(param) {
  return getJSON(URL_RANKING_REGION, param);
}

// 获取最新分类排行
export function getRankingArchive(param) {
  return getJSON(URL_RANKING_ARCHIVE, param);
}
