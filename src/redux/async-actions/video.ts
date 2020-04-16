import { AnyAction, Dispatch } from "redux";
import { setVideoInfo } from "../actions";
import { getVideoInfo, getPlayUrl } from "../../api/video";
import { createVideoByDetail } from "../../models/Video";

export default function getVideoDetail(aId: number) {
  return (dispatch: Dispatch<AnyAction>) => {
    return getVideoInfo(aId).then(async (result) => {
      if (result.code === "1") {
        const video = createVideoByDetail(result.data);
        await getPlayUrl(aId, video.cId).then((r) => {
          video.url = r.data.durl[0].url;
        });
        dispatch(setVideoInfo(video));
      }
    });
  };
}
