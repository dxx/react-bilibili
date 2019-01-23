import { getJSON, postJSON } from "./fetch";
import { URL_SEARCH_HOTWORD, URL_SEARCH_SUGGEST, URL_SEARCH } from "./url";

/**
 * 获取热搜词
 */
export function getHotwords() {
  return getJSON(URL_SEARCH_HOTWORD, null);
}

/**
 * 获取提示内容
 */
export function getSuggests(keyword: string) {
  return getJSON(URL_SEARCH_SUGGEST, { w: keyword });
}

/**
 * 获取搜索结果
 */
export function getSearchResult(param) {
  return postJSON(URL_SEARCH, param);
}
