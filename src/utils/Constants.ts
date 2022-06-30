export enum RENDER_TYPE {
  CANVAS,
  WEBGL,
}

export interface IViewPort {
  x: number
  y: number
  width: number
  height: number
}

/**
 * 定时器对象
 */
 export interface ITicker {
  tick: (dt: number) => void;
}