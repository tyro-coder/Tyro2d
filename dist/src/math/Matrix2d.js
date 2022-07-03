import HashObject from "../utils/HashObject";
/**
 * 2d矩阵类
 *  a c dx
 * [b d dy]
 *  0 0 1
 */
export default class Matrix2d extends HashObject {
    constructor(a = 1, b = 0, c = 0, d = 1, dx = 0, dy = 0) {
        super();
        this._instancedype = 'Matrix2d';
        this.set(a, b, c, d, dx, dy);
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
    set(a = 1, b = 0, c = 0, d = 1, dx = 0, dy = 0) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.dx = dx;
        this.dy = dy;
        return this;
    }
    /**
     * 复制目标矩阵的值
     * @param m 模板矩阵
     * @returns 当前矩阵
     */
    copy(m) {
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
    clone() {
        return new Matrix2d().copy(this);
    }
    /**
     * 将某个矩阵与当前矩阵连接
     * @param mtx 目标矩阵
     * @returns 当前矩阵新的值
     */
    concat(mtx) {
        const a = this.a, b = this.b, c = this.c, d = this.d, dx = this.dx, dy = this.dy;
        const ma = mtx.a, mb = mtx.b, mc = mtx.c, md = mtx.d, mx = mtx.dx, my = mtx.dy;
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
    rotate(angle) {
        const sin = Math.sin(angle), cos = Math.cos(angle);
        const a = this.a, b = this.b, c = this.c, d = this.d, dx = this.dx, dy = this.dy;
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
    scale(sx, sy) {
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
    translate(x, y) {
        this.dx += x;
        this.dy += y;
        return this;
    }
    /**
     * 将当前矩阵单位化
     * @returns 当前矩阵
     */
    identity() {
        this.a = this.d = 1;
        this.b = this.c = this.dx = this.dy = 0;
        return this;
    }
    /**
     * 将当前矩阵逆转换
     * @returns 当前矩阵
     */
    invert() {
        const a = this.a, b = this.b, c = this.c, d = this.d, dx = this.dx;
        const i = a * d - b * c;
        this.a = d / i;
        this.b = -b / i;
        this.c = -c / i;
        this.d = a / i;
        this.dx = (c * this.dy - d * dx) / i;
        this.dy = -(a * this.dy - b * dx) / i;
        return this;
    }
    destroy() {
    }
}
