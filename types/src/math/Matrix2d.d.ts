import HashObject from "../utils/HashObject";
/**
 * 2d矩阵类
 *  a c dx
 * [b d dy]
 *  0 0 1
 */
export default class Matrix2d extends HashObject {
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
    protected _instancedype: string;
    constructor(a?: number, b?: number, c?: number, d?: number, dx?: number, dy?: number);
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
    set(a?: number, b?: number, c?: number, d?: number, dx?: number, dy?: number): Matrix2d;
    /**
     * 复制目标矩阵的值
     * @param m 模板矩阵
     * @returns 当前矩阵
     */
    copy(m: Matrix2d): Matrix2d;
    /**
     * 复制当前矩阵并返回一个新的矩阵对象
     * @returns 新的矩阵
     */
    clone(): Matrix2d;
    /**
     * 将某个矩阵与当前矩阵连接
     * @param mtx 目标矩阵
     * @returns 当前矩阵新的值
     */
    concat(mtx: Matrix2d): Matrix2d;
    /**
     * 将当前矩阵进行旋转
     * @param angle 旋转的角度
     * @returns 当前矩阵
     */
    rotate(angle: number): Matrix2d;
    /**
     * 将当前矩阵进行缩放
     * @param sx x 轴缩放系数
     * @param sy y 轴缩放系数
     * @returns 当前矩阵
     */
    scale(sx: number, sy: number): Matrix2d;
    /**
     * 将当前矩阵进行平移
     * @param x x 轴平移距离
     * @param y y 轴平移距离
     * @returns 当前矩阵
     */
    translate(x: number, y: number): Matrix2d;
    /**
     * 将当前矩阵单位化
     * @returns 当前矩阵
     */
    identity(): Matrix2d;
    /**
     * 将当前矩阵逆转换
     * @returns 当前矩阵
     */
    invert(): Matrix2d;
    destroy(): void;
}
