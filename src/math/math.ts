export const DEG_TO_RAD = Math.PI / 180.0;

export const RAD_TO_DEG = 180.0 / Math.PI;

export const TAU = Math.PI * 2;

/**
 * 将一个角度转换为弧度
 * @param angle 角度
 * @returns 
 */
export function degToRed(angle: number): number {
  return angle * DEG_TO_RAD;
}

/**
 * 将一个弧度转换为角度
 * @param radians 弧度
 * @returns 
 */
export function radToDeg(radians: number): number {
  return radians * RAD_TO_DEG;
}

/**
 * 将一个值限死在某个范围内，前后闭合
 * @param val 值
 * @param low 最低值
 * @param high 最高值
 * @returns 
 */
export function clamp(val: number, low: number, high: number): number {
  return val < low ? low : val > high ? high : val;
}

/**
 * 返回最小值（包括）与最大值（不包括）之间的整数
 * @param min 最小值
 * @param max 最大值
 * @returns 随机值
 */
export function randomNum(min: number, max: number): number {
  return (~~(Math.random() * (max - min)) + min);
}
