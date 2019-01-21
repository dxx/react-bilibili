import { getJSON } from "./fetch";
import { URL_INDEX, URL_ROUND_SOWING } from "./url";

// 获取首页内容
export function getContent() {
  return getJSON(URL_INDEX, null);
}

// 获取首页轮播图
export function getBanner() {
 return getJSON(URL_ROUND_SOWING, null);
}
