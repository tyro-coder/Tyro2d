import { Vector2d } from "../index";
import HashObject from "../utils/HashObject";

export default class Polygon extends HashObject {
  protected _instanceType: string = 'Polygon'

  /** 多边形类型 */
  shapeType = 'Polygon'
  /** 起点坐标 */
  position = new Vector2d()
  /** 多边形的顶点集合 */
  verticeList: Array<Vector2d> = []
  /** 多边形的边集合 */
  edgeList: Array<Vector2d> = []

  /**
   * @param x 多边形的起点x轴
   * @param y 多边形的起点y轴
   * @param points 多边形经过的所有点集合
   */
  constructor(x: number, y: number, ...points: Array<Vector2d>) {
    super()

    this.reset(x, y, ...points)
  }

  reset(x: number, y: number, ...points: Array<Vector2d>) {
    this.position.set(x, y)
    this.setVerticeList(points)
    return this
  }

  clear() {}

  clone() {}

  setVerticeList(verticeArr: Array<Vector2d>): Polygon {
    if (!Array.isArray(verticeArr)) {
      return this
    }

    if (!(verticeArr[0] instanceof Vector2d)) {
      this.verticeList.length = 0

      verticeArr.forEach((vertice) => {
        this.verticeList.push(new Vector2d(vertice.x, vertice.y))
      })
    } else {
      this.verticeList = verticeArr
    }

    return this
  }

  destroy(): void {}
}
