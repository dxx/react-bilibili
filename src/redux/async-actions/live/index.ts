import { AnyAction, Dispatch } from "redux";
import { parse } from "query-string";
import { getLiveIndexData } from "../../../api/live";
import { setLiveData } from "../../actions";
import { Live, UpUser } from "../../../models";

const itemTitle = [
  "电台", "视频唱见", "第五人格", "王者荣耀", "网游", "手游",
  "单机", "娱乐", "绘画"
];

export default function getLiveData() {
  return (dispatch: Dispatch<AnyAction>) => {
    return getLiveIndexData().then((result) => {
      if (result.code === "1") {
        const moduleList = result.data.module_list;

        const bannerList = moduleList.find((item) => item.module_info.title === "banner位").list;
        
        const itemModuleList = moduleList.filter((item) => 
          itemTitle.indexOf(item.module_info.title) !== -1
        );

        // 直播列表
        const itemList = itemModuleList.map((item) => {
          const query = parse(item.module_info.link.substring(item.module_info.link.indexOf("?")));
          const o = {
            title: item.module_info.title,
            parentAreaId: query.parent_area_id,
            parentAreaName: query.parent_area_name,
            areaId: query.area_id,
            areaName: query.area_name,
            list: []
          };
          o.list = item.list.splice(0, 4).map((data) => 
            new Live(data.title, data.roomid, data.online, data.cover, 0, "",
              new UpUser(0, data.uname, data.face))
            )
          return o;
        });

        dispatch(setLiveData({
          bannerList,
          itemList
        }));
      }
    });
  }
}
