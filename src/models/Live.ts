import { UpUser } from "./UpUser";

/**
 * 直播信息
 */
class Live {
  constructor(
    public title: string,
    public roomId: number,
    public onlineNum: number,
    public cover: string,
    public isLive: number,
    public playUrl: string,
    public upUser: UpUser,
  ) {}
}

export {
  Live
}
