import { setPartitions } from "../actions";
import { getPartitions } from "../../api/partitions";
import { createPartitionTypesTree } from "../../models/PartitionType";

export default function getPartitionList() {
  return (dispatch, getState) => {
    return getPartitions().then((result) => {
      if (result.code === "1") {
        let partitions = createPartitionTypesTree(result.data.partitions);
        // 过滤掉 番剧，电影，电视剧，纪录片
        partitions = partitions.filter((partition) => [13, 23, 11, 177].indexOf(partition.id) === -1);
        dispatch(setPartitions(partitions));
      }
    });
  }
}
