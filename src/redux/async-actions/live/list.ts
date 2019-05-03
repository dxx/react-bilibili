import { AnyAction, Dispatch } from "redux";
import { getLiveListData } from "../../../api/live";
import { setShouldLoad, setLiveList } from "../../actions";
import { Live, UpUser } from "../../../models";

export default function getLiveListInfo(data: {
    parentAreaId: number;
    areaId: number;
    page: number,
    pageSize: number }
  ) {
  return (dispatch: Dispatch<AnyAction>) => {
    return getLiveListData(data).then((result) => {
      if (result.code === "1") {
        const list = result.data.list.map((data) => 
          new Live(data.title, data.roomid, data.online, data.user_cover, 0, "",
            new UpUser(data.uid, data.uname, data.face))
        );

        dispatch(setLiveList({
          total: result.data.count,
          list
        }));
      }
      if (process.env.REACT_ENV === "server") {
        dispatch(setShouldLoad(false));
      }
    });
  }
}