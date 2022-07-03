import Renderer from "../renderer/Renderer";
import { ITicker, IViewPort, RENDER_TYPE } from "../utils/Constants";
import Container from "./Container";
export default class Stage extends Container implements ITicker {
    canvas: HTMLCanvasElement;
    renderer: Renderer;
    paused: boolean;
    viewport: IViewPort;
    background: string | CanvasGradient | CanvasPattern;
    protected _instanceType: string;
    constructor(canvas: HTMLCanvasElement, designWidth: number, designHeight: number, viewWidth?: number, viewHeight?: number, renderType?: RENDER_TYPE);
    /**
     * 判断目标对象是否是 Stage
     * @param val 对象
     * @returns
     */
    static isStage(val: any): boolean;
    /**
     * 更新舞台在页面中的可视区域，即渲染区域。当 Canvas 的样式border|margin|padding等属性更改后，需要调用此方法更新舞台渲染区域
     * @returns 舞台的可视区域
     */
    updateViewport(): IViewPort;
    /**
     * 改变舞台的大小
     * @param width 指定舞台新的宽度
     * @param height 指定舞台新的高度
     * @param forceResize 是否强制改变舞台大小，即不管舞台大小是否相同，强制改变，可确保舞台，画布及视窗之间的尺寸同步
     */
    resize(width: number, height: number, forceResize?: boolean): void;
    /**
     *
     * @param dt 游戏循环中使用，触发舞台的更新与渲染，外部不要调用
     */
    tick(dt: number): void;
    private _initRenderer;
}
