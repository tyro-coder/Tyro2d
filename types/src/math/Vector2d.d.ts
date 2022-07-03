import HashObject from '../utils/HashObject';
export default class Vector2d extends HashObject {
    destroy(): void;
    static EMPTY: Vector2d;
    x: number;
    y: number;
    protected _instanceType: string;
    constructor();
    /**
     * 从对象池里面构造一个Vector2d对象
     * @returns Vector2d对象
     */
    static create(): Vector2d;
    /**
     * 回收该对象
     * @returns
     */
    recover(): void;
    reset(): Vector2d;
    set(x: number, y: number): Vector2d;
    setZero(): Vector2d;
    setV(v: Vector2d): Vector2d;
    add(v: Vector2d): Vector2d;
    sub(v: Vector2d): Vector2d;
    scale(x: number, y?: number): Vector2d;
    toIso(): void;
    /**
     * 将向量转为2d坐标
     * @returns
     */
    to2d(): Vector2d;
    scaleV(v: Vector2d): Vector2d;
    /**
     * 向量除以某个值
     * @param n 值
     * @returns
     */
    div(n: number): Vector2d;
    /**
     * 绝对值化向量
     * @returns
     */
    abs(): Vector2d;
    /**
     * 获取一个新的锁定在范围内的向量
     * @param low 最小值
     * @param high 最大值
     * @returns
     */
    clamp(low: number, high: number): Vector2d;
    /**
     * 将本向量锁定在范围内
     * @param low 最小值
     * @param high 最大值
     * @returns
     */
    clampSelf(low: number, high: number): Vector2d;
    /**
     * 比较向量，并将本向量更新为最小的那个
     * @param v 比较的向量
     * @returns
     */
    minV(v: Vector2d): Vector2d;
    /**
     * 比较向量，并将本向量更新为最大的那个
     * @param v 比较的向量
     * @returns
     */
    maxV(v: Vector2d): Vector2d;
    /**
     * 获得一个新的向下取整的向量
     * @returns
     */
    floor(): Vector2d;
    /**
     * 向下取整本向量
     * @returns
     */
    floorSelf(): Vector2d;
    /**
     * 获得一个新的向上取整向量
     * @returns
     */
    ceil(): Vector2d;
    /**
     * 向上取整本向量
     * @returns
     */
    ceilSelf(): Vector2d;
    /**
     * 获得一个新的取负向量
     */
    negate(): Vector2d;
    /**
     * 取负值本向量
     * @returns
     */
    negateSelf(): Vector2d;
    copy(v: Vector2d): Vector2d;
    equal(x: number | Vector2d, y?: number): boolean;
    /**
     * 将向量单位化
     * @returns
     */
    normalize(): Vector2d;
    /**
     * 改变这个向量，使其垂直于之前的向量
     */
    perp(): Vector2d;
    /**
     * 旋转本向量
     * @param angle 旋转角度
     * @param v 可选的旋转参考向量
     * @returns
     */
    rotate(angle: number, v?: Vector2d): Vector2d;
    /**
     * 获取这个向量和目标向量的点积
     * @param v 目标向量
     * @returns
     */
    dotProduct(v: Vector2d): number;
    /**
     * 获取本向量的平方长度
     * @returns
     */
    length2(): number;
    /**
     * 获取向量的长度
     * @returns
     */
    length(): number;
    /**
     * 获取与目标向量的距离
     * @param v 目标向量
     * @returns
     */
    distance(v: Vector2d): number;
    /**
     * 获取与目标向量之间的夹角
     * @param v 目标向量
     * @returns
     */
    angle(v: Vector2d): number;
    /**
     * 将本向量投射到目标向量上
     * @param v 目标向量
     * @returns
     */
    project(v: Vector2d): Vector2d;
    /**
     * 获得一个此向量的克隆副本
     * @returns
     */
    clone(): Vector2d;
    toString(): string;
    private _set;
}
