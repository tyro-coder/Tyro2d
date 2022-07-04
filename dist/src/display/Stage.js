import CanvasRenderer from "../renderer/CanvasRenderer";
import { RENDER_TYPE } from "../utils/Constants";
import Utils from "../utils/Utils";
import Container from "./Container";
export default class Stage extends Container {
    constructor(canvas, designWidth, designHeight, viewWidth = document.body.clientWidth, viewHeight = document.body.clientHeight, renderType = RENDER_TYPE.CANVAS) {
        super();
        this.paused = false;
        this.background = '';
        this._instanceType = 'Stage';
        this._initRenderer(canvas, renderType);
        this.updateViewport();
    }
    /**
     * 判断目标对象是否是 Stage
     * @param val 对象
     * @returns
     */
    static isStage(val) {
        return val instanceof Stage;
    }
    /**
     * 更新舞台在页面中的可视区域，即渲染区域。当 Canvas 的样式border|margin|padding等属性更改后，需要调用此方法更新舞台渲染区域
     * @returns 舞台的可视区域
     */
    updateViewport() {
        const canvas = this.canvas;
        let viewport;
        if (canvas.parentNode) {
            viewport = this.viewport = Utils.getElementViewRect(canvas);
        }
        return viewport;
    }
    /**
     * 改变舞台的大小
     * @param width 指定舞台新的宽度
     * @param height 指定舞台新的高度
     * @param forceResize 是否强制改变舞台大小，即不管舞台大小是否相同，强制改变，可确保舞台，画布及视窗之间的尺寸同步
     */
    resize(width, height, forceResize = false) {
        if (forceResize || this.width !== width || this.height !== height) {
            this.width = width;
            this.height = height;
            this.renderer.resize(width, height);
            this.updateViewport();
        }
    }
    /**
     *
     * @param dt 游戏循环中使用，触发舞台的更新与渲染，外部不要调用
     */
    tick(dt) {
        if (this.paused)
            return;
        this._render(this.renderer, dt);
    }
    _initRenderer(canvas, renderType) {
        if (renderType === RENDER_TYPE.CANVAS) {
            this.renderer = new CanvasRenderer();
        }
    }
}