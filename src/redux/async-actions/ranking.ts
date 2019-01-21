import { setShouldLoad, setRankingPartitions, setRankingVideos } from "../actions";
import { getRankingPartitions } from "../../api/partitions";
import { getRankings } from "../../api/ranking";
import { createPartitionTypes, createVideoByRanking } from "../../models";

export function getRankingVideoList(rId) {
  return (dispatch) => {
    return Promise.all([
      getRankingPartitions(),
      getRankings(rId)
    ]).then(([result1, result2]) => {
      if (result1.code === "1") {
        let partitions = createPartitionTypes(result1.data.partitions);
        // 过滤掉 番剧，电影，电视剧，纪录片
        partitions = partitions.filter((partition) => [33, 23, 11, 177].indexOf(partition.id) === -1);
        dispatch(setRankingPartitions(partitions));
      }
      if (result2.code === "1") {
        const list = result2.data.list;
        const rankingVideos = list.map((data) => createVideoByRanking(data));
        dispatch(setRankingVideos(rankingVideos.splice(0, 30)));
      }
      if (process.env.REACT_ENV === "server") {
        dispatch(setShouldLoad(false));
      }
    })
  }
}

export function getVideoList(rId) {
  return (dispatch) => {
    return getRankings(rId).then((result) => {
      if (result.code === "1") {
        const list = result.data.list;
        const rankingVideos = list.map((data) => createVideoByRanking(data));
        dispatch(setRankingVideos(rankingVideos.splice(0, 30)));
      }
    })
  }
}
