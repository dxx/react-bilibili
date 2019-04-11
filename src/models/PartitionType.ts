/**
 * 分类
 */
class PartitionType {
  constructor(public id: number, public name: string, public children: PartitionType[] = []) {}
}

function createPartitionTypes(data): PartitionType[] {
  return data.map((item) => new PartitionType(item.tid, item.typename));
}
/**
 * {
 *   0: [
 *     {
 *       tid: 1,
 *       typename: "动画"
 *     },
 *     {
 *       tid: 13,
 *       typename: "番剧"
 *     },
 *   ],
 *   1: [
 *     {
 *       tid: 24,
 *       typename: "MAD·AMV"
 *     }
 *   ],
 *   13: [
 *     {
 *       tid: 33,
 *       typename: "连载动画"
 *     }
 *   ]
 * }
 */
function createPartitionTypesTree(data): PartitionType[] {
  if (data) {
    let partitionTtypes = [];
    const firstTypes = data["0"];
    if (firstTypes) {
      partitionTtypes = firstTypes.map((item) => {
        const id = item.tid;
        const children = createPartitionTypes(data["" + id]);
        return new PartitionType(id, item.typename, children);
      });
    }
    return partitionTtypes;
  }
}

export {
  PartitionType,
  createPartitionTypes,
  createPartitionTypesTree
}
