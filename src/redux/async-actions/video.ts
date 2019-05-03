import { AnyAction, Dispatch } from "redux";
import { setVideoInfo } from "../actions";
import { getVideoInfo } from "../../api/video";
import { createVideoByDetail } from "../../models/Video";

export default function getVideoDetail(aId: number) {
  return (dispatch: Dispatch<AnyAction>) => {
    return getVideoInfo(aId).then((result) => {
      if (result.code === "1") {
        const video = createVideoByDetail(result.data.videoInfo);
        dispatch(setVideoInfo(video));
      }
    });
  };
}
