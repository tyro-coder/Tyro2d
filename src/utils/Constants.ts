export interface IViewPort {
  x: number
  y: number
  width: number
  height: number
}

/**
 * 定时器对象
 */
export interface ITickerHandler {
  tick: (dt: number) => void;
}
