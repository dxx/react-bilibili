import { UpUser } from "./UpUser";
import { PartitionType } from "./PartitionType";

/**
 * 视频
 */
class Video {
  public aId: number;
  public title: string;
  public pic: string;
  public desc: string;
  public playCount: number;
  public barrageCount: number;
  public publicDate: number;
  public duration: any;
  public cId: number;
  public url: string;
  public owner: UpUser;
  public twoLevel: PartitionType;
  public oneLevel: PartitionType;
  constructor(
    aId,
    title,
    pic,
    desc,
    playCount,
    barrageCount,
    publicDate,
    duration,
    cId,
    url,
    owner = null , twoLevel = null, oneLevel = null) {
    this.aId = aId;
    this.title = title;
    this.pic = pic;
    this.desc = desc;
    this.playCount = playCount;
    this.barrageCount = barrageCount;
    this.publicDate = publicDate;
    this.duration = duration;
    this.cId = cId;
    this.url = url;
    this.owner = owner;
    this.twoLevel = twoLevel;
    this.oneLevel = oneLevel;
  }
}

function createVideo(data) {
  return new Video(
    data.aid,
    data.title,
    data.pic,
    data.desc,
    data.stat.view,
    data.stat.danmaku,
    data.pubdate,
    data.duration,
    data.cid,
    data.initUrl,
    new UpUser(data.owner.mid, data.owner.name, data.owner.face),
    data.tid ? new PartitionType(data.tid, data.tname) : null,
    data.reid ? new PartitionType(data.reid, data.toptype) : null
  );
}

function createVideoByDetail(data) {
  return new Video(
    data.aid,
    data.title,
    data.pic,
    data.desc,
    data.stat.view,
    data.stat.danmaku,
    data.pubdate,
    data.initDuration,
    data.cid,
    data.initUrl,
    new UpUser(data.owner.mid, data.owner.name, data.owner.face),
    data.tid ? new PartitionType(data.tid, data.tname) : null,
    data.reid ? new PartitionType(data.reid, data.toptype) : null
  );
}

function createVideoByRanking(data) {
  return new Video(
    parseInt(data.aid, 10),
    data.title,
    data.pic,
    "",
    data.play,
    data.video_review,
    0,
    data.duration,
    0,
    "",
    new UpUser(0, data.author, "")
  );
}

function createVideoByLatest(data) {
  return new Video(
    data.aid,
    data.title,
    data.pic,
    data.desc,
    data.stat.view,
    data.stat.danmaku,
    data.pubdate,
    data.duration,
    data.cid,
    "",
    new UpUser(data.mid, data.author, data.face)
  );
}

function createVideoByUser(data) {
  return new Video(
    data.aid,
    data.title,
    data.pic,
    "",
    data.play,
    data.video_review,
    0,
    data.length,
    0,
    "",
    new UpUser(data.mid, data.author, "")
  );
}

function createVideoBySearch(data) {
  const times = data.duration.split(":");
  const seconds = parseInt(times[0], 10) * 60 + parseInt(times[1], 10);
  return new  Video(
    data.aid,
    data.title,
    data.pic,
    data.description,
    data.play,
    data.video_review,
    data.pubdata,
    seconds,
    0,
    "",
    new UpUser(data.mid, data.author, "")
  );
}

export {
  Video,
  createVideo,
  createVideoByDetail,
  createVideoByRanking,
  createVideoByLatest,
  createVideoByUser,
  createVideoBySearch
}
