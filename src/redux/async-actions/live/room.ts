import { AnyAction, Dispatch } from "redux";
import { getRoomInfo, getPlayUrl } from "../../../api/live";
import { setRoomData } from "../../actions";
import { Live } from "../../../models";

export default function getRoomData(roomId: number) {
  return (dispatch: Dispatch<AnyAction>) => {
    const promises = [getRoomInfo(roomId), getPlayUrl(roomId)];
    return Promise.all(promises).then(([result1, result2]) => {
      if (result1.code === "1") {
        const data = result1.data;
        const live = new Live(
          data.title,
          data.room_id,
          data.online,
          data.user_cover,
          data.live_status,
          "",
          null
        );
        live.playUrl = result2.data.durl[result2.data.current_quality - 1].url;
        
        dispatch(setRoomData({
          parentAreaId: data.parent_area_id,
          parentAreaName: data.parent_area_name,
          areaId: data.area_id,
          areaName: data.area_name,
          uId: data.uid,
          description: data.description,
          liveTime: data.live_time,
          live,
        }));
      }
    });
  };
}
