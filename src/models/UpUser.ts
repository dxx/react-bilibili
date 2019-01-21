/**
 * up主
 */
class UpUser {
  public mId: number;
  public name: string;
  public face: string;
  public level: number;
  public sex: string;
  public sign: string;
  public following: number;
  public follower: number;
  constructor(mId, name, face, level = 0, sex = "保密", sign = "", following = 0, follower = 0) {
    this.mId = mId;
    this.name = name;
    this.face = face;
    this.level = level;
    this.sex = sex;
    this.sign = sign;
    this.following = following;
    this.follower = follower;
  }
}

export {
  UpUser
}
