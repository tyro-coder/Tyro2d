import HashObject from '../utils/HashObject';
import Pool, { POOL_SIGN } from '../utils/Pool';
import MathTool from './MathTool';
import Vector2d from './Vector2d';

/**
 * 2d矩阵类
 *  a c dx
 * [b d dy]
 *  0 0 1
 */
export default class Matrix2d extends HashObject {
  static EMPTY: Matrix2d = new Matrix2d();

  /** 缩放或旋转图像时，影响像素沿 x 轴定位的值 */
  a: number;
  /** 倾斜或旋转图像时，影响像素沿 y 轴定位的值 */
  b: number;
  /** 倾斜或旋转图像时，影响像素沿 x 轴定位的值 */
  c: number;
  /** 缩放或旋转图像时，影响像素沿 y 轴定位的值 */
  d: number;
  /** 沿 x 轴平移每个点的距离 */
  dx: number;
  /** 沿 y 轴平移每个点的距离 */
  dy: number;

  protected _instanceType: string = 'Matrix2d';

  constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, dx: number = 0, dy: number = 0) {
    super();
    this.reset(a, b, c, d, dx, dy);
  }

  /**
   * 设置当前矩阵的值
   * @param a
   * @param b
   * @param c
   * @param d
   * @param dx
   * @param dy
   * @returns
   */
  reset(a: number = 1, b: number = 0, c: number = 0, d: number = 1, dx: number = 0, dy: number = 0): Matrix2d {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.dx = dx;
    this.dy = dy;
    return this;
  }

  clear() {
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.dx = 0;
    this.dy = 0;
  }

  recover() {
    if (this === Matrix2d.EMPTY) return;
    this.clear();
    Pool.recover(POOL_SIGN.Matrix2d, this);
  }

  /**
   * 复制目标矩阵的值
   * @param m 模板矩阵
   * @returns 当前矩阵
   */
  copy(m: Matrix2d): Matrix2d {
    this.a = m.a;
    this.b = m.b;
    this.c = m.c;
    this.d = m.d;
    this.dx = m.dx;
    this.dy = m.dy;
    return this;
  }

  /**
   * 复制当前矩阵并返回一个新的矩阵对象
   * @returns 新的矩阵
   */
  clone(): Matrix2d {
    return new Matrix2d().copy(this);
  }

  /**
   * 将某个矩阵与当前矩阵连接
   * @param mtx 目标矩阵
   * @returns 当前矩阵新的值
   */
  concat(mtx: Matrix2d): Matrix2d {
    const { a } = this,
{ b } = this,
{ c } = this,
{ d } = this,
{ dx } = this,
{ dy } = this;
    const ma = mtx.a,
mb = mtx.b,
mc = mtx.c,
md = mtx.d,
mx = mtx.dx,
my = mtx.dy;

    this.a = a * ma + b * mc;
    this.b = a * mb + b * md;
    this.c = c * ma + d * mc;
    this.d = c * mb + d * md;
    this.dx = dx * ma + dy * mc + mx;
    this.dy = dx * mb + dy * md + my;
    return this;
  }

  /**
   * 将当前矩阵进行旋转
   * @param angle 旋转的角度
   * @returns 当前矩阵
   */
  rotate(angle: number): Matrix2d {
    const red = MathTool.degToRad(angle);
    const sin = Math.sin(red),
cos = Math.cos(red);
    const { a } = this,
{ b } = this,
{ c } = this,
{ d } = this,
{ dx } = this,
{ dy } = this;

    this.a = a * cos + c * sin;
    this.b = b * cos + d * sin;
    this.c = c * cos - a * sin;
    this.d = d * cos - b * sin;
    this.dx = dx * cos - dy * sin;
    this.dy = dx * sin + dy * cos;
    return this;
  }

  /**
   * 将当前矩阵进行缩放
   * @param sx x 轴缩放系数，偏移系数
   * @param sy y 轴缩放系数，偏移系数
   * @returns 当前矩阵
   */
  scale(sx: number, sy: number): Matrix2d {
    this.a *= sx;
		this.b *= sx;
		this.c *= sy;
		this.d *= sy;
    return this;
  }

  /**
   * 将当前矩阵进行平移
   * @param x x 轴平移距离
   * @param y y 轴平移距离
   * @returns 当前矩阵
   */
  translate(x: number, y: number): Matrix2d {
    this.dx += x;
    this.dy += y;
    return this;
  }

  /**
   * 将当前矩阵单位化
   * @returns 当前矩阵
   */
  identity(): Matrix2d {
    this.a = this.d = 1;
    this.b = this.c = this.dx = this.dy = 0;
    return this;
  }

  /**
   * 将当前矩阵逆转换
   * @returns 当前矩阵
   */
  invert(): Matrix2d {
    const { a } = this,
{ b } = this,
{ c } = this,
{ d } = this,
{ dx } = this;
    const i = a * d - b * c;

    this.a = d / i;
    this.b = -b / i;
    this.c = -c / i;
    this.d = a / i;
    this.dx = (c * this.dy - d * dx) / i;
    this.dy = -(a * this.dy - b * dx) / i;
    return this;
  }

  destroy(): void {
  }
}
