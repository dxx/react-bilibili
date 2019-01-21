import * as ActionTypes from "./action-types";

export function setShouldLoad(shouldLoad) {
  return { type: ActionTypes.SET_SHOULD_LOAD, shouldLoad };
}

export function setOneLevelPartitions(oneLevelPartitions) {
  return { type: ActionTypes.SET_ONE_LEVEL_PARTITIONS, oneLevelPartitions};
}

export function setBanners(banners) {
  return { type: ActionTypes.SET_BANNERS, banners};
}

export function setAdditionalVideos(additionalVideos) {
  return { type: ActionTypes.SET_ADDITIONAL_VIDEOS, additionalVideos};
}

export function setRankingVideos(rankingVideos) {
  return { type: ActionTypes.SET_RANKING_VIDEOS, rankingVideos};
}

export function setPartitions(partitions) {
  return { type: ActionTypes.SET_PARTITIONS, partitions};
}

export function setRankingPartitions(rankingPartitions) {
  return { type: ActionTypes.SET_RANKING_PARTITIONS, rankingPartitions};
}

export function setVideoInfo(video) {
  return { type: ActionTypes.SET_VIDEO_INFO, video};
}

export function setUpUserInfo(upUser) {
  return { type: ActionTypes.SET_UP_USER, upUser};
}
