export default class MathTool {
    static DEG_TO_RAD: number;
    static RAD_TO_DEG: number;
    static TAU: number;
    /**
     * 将一个角度转换为弧度
     * @param angle 角度
     * @returns
     */
    static degToRed(angle: number): number;
    /**
     * 将一个弧度转换为角度
     * @param radians 弧度
     * @returns
     */
    static radToDeg(radians: number): number;
    /**
     * 将一个值限死在某个范围内，前后闭合
     * @param val 值
     * @param low 最低值
     * @param high 最高值
     * @returns
     */
    static clamp(val: number, low: number, high: number): number;
    /**
     * 返回最小值（包括）与最大值（不包括）之间的整数
     * @param min 最小值
     * @param max 最大值
     * @returns 随机值
     */
    static randomNum(min: number, max: number): number;
}
