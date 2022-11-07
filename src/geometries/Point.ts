import HashObject from "../utils/HashObject";

export default class Point extends HashObject {
  protected _instanceType: string = 'Point'
  /** x值 */
  x = 0
  /** y值 */
  y = 0

  constructor(x: number = 0, y: number = 0) {
    super()
    
    this.reset(x, y)
  }

  reset(x: number, y: number): Point {
    this.x = x
    this.y = y
    return this
  }

  clear() {
    this.x = 0
    this.y = 0
  }

  clone() {
    return new Point(this.x, this.y)
  }

  /**
   * 判断是否跟某个x，y坐标相等
   * @param x 比较的x值
   * @param y 比较的y值
   * @returns 
   */
  equals(x: number, y: number) {
    return this.x === x && this.y === y
  }

  /**
   * 判断是否跟某个点位置相同
   * @param point 判断的点
   * @returns 
   */
  equalsPoint(point: Point) {
    return this.x === point.x && this.y === point.y
  }

  destroy() {}
}
