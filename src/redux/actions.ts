import * as ActionTypes from "./action-types";
import { AnyAction } from "redux";
import { Video, UpUser } from "../models";

export function setShouldLoad(shouldLoad: boolean): AnyAction {
  return { type: ActionTypes.SET_SHOULD_LOAD, shouldLoad };
}

export function setOneLevelPartitions(oneLevelPartitions: Array<any>): AnyAction {
  return { type: ActionTypes.SET_ONE_LEVEL_PARTITIONS, oneLevelPartitions};
}

export function setBanners(banners: Array<any>): AnyAction {
  return { type: ActionTypes.SET_BANNERS, banners };
}

export function setAdditionalVideos(additionalVideos: Array<any>): AnyAction {
  return { type: ActionTypes.SET_ADDITIONAL_VIDEOS, additionalVideos };
}

export function setRankingVideos(rankingVideos: Array<any>): AnyAction {
  return { type: ActionTypes.SET_RANKING_VIDEOS, rankingVideos };
}

export function setPartitions(partitions: Array<any>): AnyAction {
  return { type: ActionTypes.SET_PARTITIONS, partitions };
}

export function setRankingPartitions(rankingPartitions: Array<any>): AnyAction {
  return { type: ActionTypes.SET_RANKING_PARTITIONS, rankingPartitions };
}

export function setVideoInfo(video: Video): AnyAction {
  return { type: ActionTypes.SET_VIDEO_INFO, video };
}

export function setUpUserInfo(upUser: UpUser): AnyAction {
  return { type: ActionTypes.SET_UP_USER, upUser };
}


export function setLiveData(liveData: any): AnyAction {
  return { type: ActionTypes.SET_LIVE_DATA, liveData };
}

export function setLiveList(liveListData: any): AnyAction {
  return { type: ActionTypes.SET_LIVE_LIST, liveListData };
}

export function setRoomData(roomData: any): AnyAction {
  return { type: ActionTypes.SET_ROOM_DATA, roomData };
}
