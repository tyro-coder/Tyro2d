import { Vector2d } from "../index";
import Bounds from "../physics/Bounds";
import HashObject from "../utils/HashObject";
import Pool, { POOL_SIGN } from "../utils/Pool";

export default class Polygon extends HashObject {
  protected _instanceType: string = 'Polygon'

  /** 多边形类型 */
  shapeType = 'Polygon'
  /** 起点坐标向量 */
  position = Vector2d.EMPTY
  /** 多边形的顶点向量集合 */
  verticeList: Array<Vector2d> = []
  /** 多边形的边向量集合 */
  edgeList: Array<Vector2d> = []
  /** 法线向量集合 */
  normalList: Array<Vector2d> = []

  /** 多边形的包围盒 */
  private _bounds: Bounds = Bounds.EMPTY

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

  clear() {
    this.position = Vector2d.EMPTY
    this.verticeList = []
    this.edgeList = []
    this.normalList = []
    this._bounds = Bounds.EMPTY
    Pool.recover(POOL_SIGN.Polygon, this)
  }

  clone() {
    return Pool.getInstanceByClass(POOL_SIGN.Polygon, Polygon).reset(
      this.position.x,
      this.position.y,
      ...this.verticeList,
    )
  }

  /**
   * 设置顶点数组
   * @param verticeArr 顶点数组
   * @returns 
   */
  setVerticeList(verticeArr: Array<Vector2d>): Polygon {
    if (!Array.isArray(verticeArr)) {
      return this
    }

    if (!(verticeArr[0] instanceof Vector2d)) {
      this.verticeList.length = 0

      verticeArr.forEach((vertice) => {
        this.verticeList.push(
          Pool.getInstanceByClass(POOL_SIGN.Vector2d, Vector2d).reset(vertice.x, vertice.y)
        )
      })
    } else {
      this.verticeList = verticeArr
    }

    this.calcEdgeAndNormal()
    this.updateBounds()
    return this
  }

  /**
   * 根据顶点向量数组，计算多边形的边向量数组和法线向量数组
   * @returns 
   */
  calcEdgeAndNormal() {
    const edges = this.edgeList, normals = this.normalList, points = this.verticeList
    const len = points.length

    if (len < 3) {
      throw new Error('多边形至少需要3个点')
    }

    for (let i = 0; i < len; i++) {
      if (edges[i] === undefined) {
        edges[i] = Pool.getInstanceByClass(POOL_SIGN.Vector2d, Vector2d)
      }
      edges[i].copy(points[(i + 1) % len]).sub(points[i])

      if (normals[i] === undefined) {
        normals[i] = Pool.getInstanceByClass(POOL_SIGN.Vector2d, Vector2d)
      }
      normals[i].copy(edges[i]).perp().normalize()
    }

    edges.length = len
    normals.length = len

    return this
  }

  /**
   * 更新多边形的包围盒
   * @returns 
   */
  updateBounds() {
    this.bounds.update(this.verticeList)
    this.bounds.translateByVector(this.position)

    return this.bounds
  }

  /** 多边形的包围盒 */
  get bounds(): Bounds {
    if (this._bounds === Bounds.EMPTY) {
      this._bounds = Pool.getInstanceByClass(POOL_SIGN.Bounds, Bounds)
    }
    return this._bounds
  }

  destroy(): void {}
}
