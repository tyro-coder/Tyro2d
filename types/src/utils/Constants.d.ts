export declare enum RENDER_TYPE {
    CANVAS = 0,
    WEBGL = 1
}
export interface IViewPort {
    x: number;
    y: number;
    width: number;
    height: number;
}
/**
 * 定时器对象
 */
export interface ITicker {
    tick: (dt: number) => void;
}
