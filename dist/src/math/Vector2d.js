import HashObject from '../utils/HashObject';
import Pool from '../utils/Pool';
import MathTool from './MathTool';
export default class Vector2d extends HashObject {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this._instanceType = 'Vector2d';
        this.reset();
    }
    destroy() {
      
    }
    /**
     * 从对象池里面构造一个Vector2d对象
     * @returns Vector2d对象
     */
    static create() {
        return Pool.getInstanceByClass('Vector2d', Vector2d);
    }
    /**
     * 回收该对象
     * @returns
     */
    recover() {
        if (this === Vector2d.EMPTY)
            return;
        Pool.recover('Vector2d', this.reset());
    }
    reset() {
        this.x = 0;
        this.y = 0;
        return this;
    }
    set(x, y) {
        return this._set(x, y);
    }
    setZero() {
        return this.set(0, 0);
    }
    setV(v) {
        return this._set(v.x, v.y);
    }
    add(v) {
        return this._set(this.x + v.x, this.y + v.y);
    }
    sub(v) {
        return this._set(this.x - v.x, this.y - v.y);
    }
    scale(x, y) {
        return this._set(this.x * x, this.y * (typeof y !== 'undefined' ? y : x));
    }
    toIso() {
    }
    /**
     * 将向量转为2d坐标
     * @returns
     */
    to2d() {
        return this._set(this.y + this.x / 2, this.y - this.x / 2);
    }
    scaleV(v) {
        return this._set(this.x * v.x, this.y * v.y);
    }
    /**
     * 向量除以某个值
     * @param n 值
     * @returns
     */
    div(n) {
        return this._set(this.x / n, this.y / n);
    }
    /**
     * 绝对值化向量
     * @returns
     */
    abs() {
        return this._set((this.x < 0) ? -this.x : this.x, (this.y < 0) ? -this.y : this.y);
    }
    /**
     * 获取一个新的锁定在范围内的向量
     * @param low 最小值
     * @param high 最大值
     * @returns
     */
    clamp(low, high) {
        return Vector2d.create().set(MathTool.clamp(this.x, low, high), MathTool.clamp(this.y, low, high));
    }
    /**
     * 将本向量锁定在范围内
     * @param low 最小值
     * @param high 最大值
     * @returns
     */
    clampSelf(low, high) {
        return this._set(MathTool.clamp(this.x, low, high), MathTool.clamp(this.y, low, high));
    }
    /**
     * 比较向量，并将本向量更新为最小的那个
     * @param v 比较的向量
     * @returns
     */
    minV(v) {
        return this._set((this.x < v.x) ? this.x : v.x, (this.y < v.y) ? this.y : v.y);
    }
    /**
     * 比较向量，并将本向量更新为最大的那个
     * @param v 比较的向量
     * @returns
     */
    maxV(v) {
        return this._set((this.x > v.x) ? this.x : v.x, (this.y > v.y) ? this.y : v.y);
    }
    /**
     * 获得一个新的向下取整的向量
     * @returns
     */
    floor() {
        return Vector2d.create().set(Math.floor(this.x), Math.floor(this.y));
    }
    /**
     * 向下取整本向量
     * @returns
     */
    floorSelf() {
        return this._set(Math.floor(this.x), Math.floor(this.y));
    }
    /**
     * 获得一个新的向上取整向量
     * @returns
     */
    ceil() {
        return Vector2d.create().set(Math.ceil(this.x), Math.ceil(this.y));
    }
    /**
     * 向上取整本向量
     * @returns
     */
    ceilSelf() {
        return this._set(Math.ceil(this.x), Math.ceil(this.y));
    }
    /**
     * 获得一个新的取负向量
     */
    negate() {
        return Vector2d.create().set(-this.x, -this.y);
    }
    /**
     * 取负值本向量
     * @returns
     */
    negateSelf() {
        return this._set(-this.x, -this.y);
    }
    copy(v) {
        return this._set(v.x, v.y);
    }
    equal(x, y) {
        let _x, _y;
        if (typeof x === 'number' && typeof y === 'number') {
            _x = x;
            _y = y;
        }
        else {
            _x = x.x;
            _y = x.y;
        }
        return ((this.x === _x) && (this.y === _y));
    }
    /**
     * 将向量单位化
     * @returns
     */
    normalize() {
        return this.div(this.length() || 1);
    }
    /**
     * 改变这个向量，使其垂直于之前的向量
     */
    perp() {
        return this._set(this.y, -this.x);
    }
    /**
     * 旋转本向量
     * @param angle 旋转角度
     * @param v 可选的旋转参考向量
     * @returns
     */
    rotate(angle, v) {
        let cx = 0, cy = 0;
        if (v && typeof v === 'object') {
            cx = v.x;
            cy = v.y;
        }
        const x = this.x - cx;
        const y = this.y - cy;
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return this._set(x * c - y * s + cx, x * s + y * c + cy);
    }
    /**
     * 获取这个向量和目标向量的点积
     * @param v 目标向量
     * @returns
     */
    dotProduct(v) {
        return this.x * v.x + this.y * v.y;
    }
    /**
     * 获取本向量的平方长度
     * @returns
     */
    length2() {
        return this.dotProduct(this);
    }
    /**
     * 获取向量的长度
     * @returns
     */
    length() {
        return Math.sqrt(this.length2());
    }
    /**
     * 获取与目标向量的距离
     * @param v 目标向量
     * @returns
     */
    distance(v) {
        const dx = this.x - v.x, dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    /**
     * 获取与目标向量之间的夹角
     * @param v 目标向量
     * @returns
     */
    angle(v) {
        return Math.acos(MathTool.clamp(this.dotProduct(v) / (this.length() * v.length()), -1, 1));
    }
    /**
     * 将本向量投射到目标向量上
     * @param v 目标向量
     * @returns
     */
    project(v) {
        return this.scale(this.dotProduct(v) / v.length2());
    }
    /**
     * 获得一个此向量的克隆副本
     * @returns
     */
    clone() {
        return Vector2d.create().set(this.x, this.y);
    }
    toString() {
        return `(x: ${this.x}, y: ${this.y})`;
    }
    _set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
}
Vector2d.EMPTY = new Vector2d();
