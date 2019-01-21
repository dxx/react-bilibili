import { getContent, getBanner } from "../../api/index";
import { createPartitionTypes, createVideo, createVideoByRanking } from "../../models";
import {
  setOneLevelPartitions,
  setBanners,
  setAdditionalVideos,
  setRankingVideos
} from "../actions";
import { getRankings } from "../../api/ranking";

export default function getIndexContent() {
  // dispatch由thunkMiddleware传入
  return (dispatch, getState) => {
    const promises = [
      getContent(),
      getBanner(),
      getRankings(0),
    ];
    return Promise.all(promises).then(([result1, result2, result3]) => {
      if (result1.code === "1") {
        const partitions = result1.data.partitions["0"];
        let oneLevels =  createPartitionTypes(partitions);
        // 过滤掉 番剧，电影，电视剧，纪录片
        oneLevels = oneLevels.filter((partition) => [13, 23, 11, 177].indexOf(partition.id) === -1);
        dispatch(setOneLevelPartitions(oneLevels));

        const additionalContent = result1.data.content.additionalContent;

        if (additionalContent) {
          const additionalVideos = additionalContent.map((content) => createVideo(content.archive));
          dispatch(setAdditionalVideos(additionalVideos));
        }
      }
      if (result2.code === "1") {
        const data = result2.data;
        const banners = data.map((item) => (
          {
            id: item.id,
            name: item.name,
            pic: item.pic,
            url: item.url
          }
        ));
        dispatch(setBanners(banners));
      }
      if (result3.code === "1") {
        const list = result3.data.list;
        const rankingVideos = list.map((data) => createVideoByRanking(data));

        dispatch(setRankingVideos(rankingVideos));
      }
    });
  }
}
