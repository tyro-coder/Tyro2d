import HashObject from "../utils/HashObject";

/**
 * 2d矩阵类
 *  a c dx
 * [b d dy]
 *  0 0 1
 */
export default class Matrix2d extends HashObject {
  /** 缩放或旋转图像时，影响像素沿 x 轴定位的值 */
  a: number
  /** 倾斜或旋转图像时，影响像素沿 y 轴定位的值 */
  b: number
  /** 倾斜或旋转图像时，影响像素沿 x 轴定位的值 */
  c: number
  /** 缩放或旋转图像时，影响像素沿 y 轴定位的值 */
  d: number
  /** 沿 x 轴平移每个点的距离 */
  dx: number
  /** 沿 y 轴平移每个点的距离 */
  dy: number

  protected _instancedype: string = 'Matrix2d'

  constructor(a: number = 1, b: number = 0, c: number = 0 , d: number = 1, dx: number = 0, dy: number = 0) {
    super()
    this.set(a, b, c, d, dx, dy)
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
  set(a: number = 1, b: number = 0, c: number = 0, d: number = 1, dx: number = 0, dy: number = 0): Matrix2d {
    this.a = a
    this.b = b
    this.c = c
    this.d = d
    this.dx = dx
    this.dy = dy
    return this
  }

  /**
   * 复制目标矩阵的值
   * @param m 模板矩阵
   * @returns 当前矩阵
   */
  copy(m: Matrix2d): Matrix2d {
    this.a = m.a
    this.b = m.b
    this.c = m.c
    this.d = m.d
    this.dx = m.dx
    this.dy = m.dy
    return this
  }

  /**
   * 复制当前矩阵并返回一个新的矩阵对象
   * @returns 新的矩阵
   */
  clone(): Matrix2d {
    return new Matrix2d().copy(this)
  }

  /**
   * 将某个矩阵与当前矩阵连接
   * @param mtx 目标矩阵 
   * @returns 当前矩阵新的值
   */
  concat(mtx: Matrix2d): Matrix2d {
    let a = this.a, b = this.b, c = this.c, d = this.d, dx = this.dx, dy = this.dy;
    let ma = mtx.a, mb = mtx.b, mc = mtx.c, md = mtx.d,  mx = mtx.dx, my = mtx.dy;

    this.a = a * ma + b * mc
    this.b = a * mb + b * md
    this.c = c * ma + d * mc
    this.d = c * mb + d * md
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
    let sin = Math.sin(angle), cos = Math.cos(angle);
    let a = this.a, b = this.b, c = this.c, d = this.d, dx = this.dx, dy = this.dy;

    this.a = a * cos - b * sin;
    this.b = a * sin + b * cos;
    this.c = c * cos - d * sin;
    this.d = c * sin + d * cos;
    this.dx = dx * cos - dy * sin;
    this.dy = dx * sin + dy * cos;
    return this;
  }

  /**
   * 将当前矩阵进行缩放
   * @param sx x 轴缩放系数
   * @param sy y 轴缩放系数
   * @returns 当前矩阵
   */
  scale(sx: number, sy: number): Matrix2d {
    this.a *= sx;
    this.d *= sy;
    this.c *= sx;
    this.b *= sy;
    this.dx *= sx;
    this.dy *= sy;
    return this;
  }

  /**
   * 将当前矩阵进行平移
   * @param x x 轴平移距离
   * @param y y 轴平移距离
   * @returns 当前矩阵
   */
  translate(x: number, y: number): Matrix2d {
    this.dx += x
    this.dy += y
    return this
  }

  /**
   * 将当前矩阵单位化
   * @returns 当前矩阵
   */
  identity(): Matrix2d {
    this.a = this.d = 1
    this.b = this.c = this.dx = this.dy = 0
    return this
  }

  /**
   * 将当前矩阵逆转换
   * @returns 当前矩阵
   */
  invert(): Matrix2d {
    let a = this.a, b = this.b, c = this.c, d = this.d, dx = this.dx, dy = this.dy;
    let i = a * d - b * c;

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
