export default class Utils {
  /**@private */
  private static _gid: number = 1;

  /**获取一个全局唯一ID。*/
  static getGID(): number {
    return Utils._gid++;
  }
}