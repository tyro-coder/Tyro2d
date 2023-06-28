import Point from '../geometries/Point';
import { Vector2d } from '../index';
import HashObject from '../utils/HashObject';
import Pool, { POOL_SIGN } from '../utils/Pool';

export default class Bounds extends HashObject {
  static EMPTY: Bounds = new Bounds();

  minPoint: Point;
  maxPoint: Point;

  constructor(verticeList?: Array<Vector2d>) {
    super();

    this.reset(verticeList);
  }

  reset(verticeList?: Array<Vector2d>) {
    if (this.minPoint === undefined) {
      this.minPoint = Pool.getInstanceByClass(POOL_SIGN.Point, Point).reset(Infinity, Infinity);
      this.maxPoint = Pool.getInstanceByClass(POOL_SIGN.Point, Point).reset(-Infinity, -Infinity);
    }
    if (typeof verticeList !== 'undefined') {
      this.update(verticeList);
    }
  }

  clear() {
    this.minPoint.reset(Infinity, Infinity);
    this.maxPoint.reset(-Infinity, -Infinity);
  }

  recover() {
    if (this === Bounds.EMPTY) return;
    this.clear();
    Pool.recover(POOL_SIGN.Bounds, this);
  }

  get x() {
    return this.minPoint.x;
  }
  set x(value: number) {
    const deltaX = this.maxPoint.x - this.minPoint.x;
    this.minPoint.x = value;
    this.maxPoint.x = value + deltaX;
  }

  get y() {
    return this.minPoint.y;
  }
  set y(value) {
    const deltaY = this.maxPoint.y - this.minPoint.y;
    this.minPoint.y = value;
    this.maxPoint.y = value + deltaY;
  }

  get width() {
    return this.maxPoint.x - this.minPoint.x;
  }
  set width(value) {
    this.maxPoint.x = this.minPoint.x + value;
  }

  get height() {
    return this.maxPoint.y - this.minPoint.y;
  }
  set height(value) {
    this.maxPoint.y = this.minPoint.y + value;
  }

  get left() {
    return this.minPoint.x;
  }
  get right() {
    return this.maxPoint.x;
  }
  get top() {
    return this.minPoint.y;
  }
  get bottom() {
    return this.maxPoint.y;
  }

  get centerX() {
    return this.minPoint.x + (this.width * 0.5);
  }
  get centerY() {
    return this.minPoint.y + (this.height * 0.5);
  }

  addBounds(bounds: Bounds, clear = false) {
    if (clear === true) {
      this.maxPoint.x = bounds.maxPoint.x;
      this.minPoint.x = bounds.minPoint.x;
      this.maxPoint.y = bounds.maxPoint.y;
      this.minPoint.y = bounds.minPoint.y;
    } else {
      if (bounds.maxPoint.x > this.maxPoint.x) this.maxPoint.x = bounds.maxPoint.x;
      if (bounds.minPoint.x > this.minPoint.x) this.minPoint.x = bounds.minPoint.x;
      if (bounds.maxPoint.y > this.maxPoint.y) this.maxPoint.y = bounds.maxPoint.y;
      if (bounds.minPoint.y > this.minPoint.y) this.minPoint.y = bounds.minPoint.y;
    }
  }

  // TODO 当这个点所在位置有矩阵旋转的话，需要额外处理
  addPoint(point: Point) {
    this.minPoint.x = Math.min(this.minPoint.x, point.x);
    this.maxPoint.x = Math.max(this.maxPoint.x, point.x);
    this.minPoint.y = Math.min(this.minPoint.y, point.y);
    this.maxPoint.y = Math.max(this.maxPoint.y, point.y);
  }

  /**
   * 根据多边形的顶点向量集合，生成新的包围盒
   * @param verticeList 多边形的顶点向量集合
   */
  update(verticeList: Array<Vector2d>) {
    this.clear();
    for (let i = 0; i < verticeList.length; i++) {
      const vertex = verticeList[i];
      if (vertex.x > this.maxPoint.x) this.maxPoint.x = vertex.x;
      if (vertex.x < this.minPoint.x) this.minPoint.x = vertex.x;
      if (vertex.y > this.maxPoint.y) this.maxPoint.y = vertex.y;
      if (vertex.y < this.minPoint.y) this.minPoint.y = vertex.y;
    }
  }

  /**
   * 包围盒偏移
   * @param x x轴偏移量
   * @param y y轴偏移量
   */
  translate(x: number, y: number) {
    this.minPoint.x += x;
    this.maxPoint.x += x;
    this.minPoint.y += y;
    this.maxPoint.y += y;
  }

  /**
   * 根据二维向量进行偏移
   * @param v 参考的二维向量
   */
  translateByVector(v: Vector2d) {
    this.translate(v.x, v.y);
  }

  destroy(): void {}
}
