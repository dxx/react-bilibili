/**
 * up主
 */
class UpUser {
  constructor(
    public mId: number,
    public name: string,
    public face: string,
    public level: number = 0,
    public sex: string = "保密",
    public sign: string = "",
    public following: number = 0,
    public follower: number = 0) {}
}

export {
  UpUser
}
