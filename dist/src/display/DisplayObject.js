import EventDispatcher from "../event/EventDispatcher";
import Stage from "./Stage";
export default class DisplayObject extends EventDispatcher {
    constructor() {
        super();
        /** 可视对象是否可见，默认为true */
        this.visible = true;
        /** 可视对象是否可接受交互事件 */
        this.mouseEnable = true;
        /** 可视对象的渲染方式 */
        this.blendMode = 'source-over';
        this._instanceType = 'DisplayObject';
        this._width = 0;
        this._height = 0;
        this._x = 0;
        this._y = 0;
        this._opacity = 1;
        this._destroyed = false;
        this._parent = null;
    }
    get stage() {
        let obj = this.parent;
        while (obj || !Stage.isStage(obj)) {
            obj = obj.parent;
        }
        return obj;
    }
    get opacity() {
        return this._opacity;
    }
    set opacity(val) {
        if (this._opacity !== val) {
            this._opacity = val;
        }
    }
    get x() {
        return this._x;
    }
    set x(val) {
        if (this._x !== val) {
            this._x = val;
        }
    }
    get y() {
        return this._y;
    }
    set y(val) {
        if (this._y !== val) {
            this._y = val;
        }
    }
    get width() {
        return this._width;
    }
    set width(val) {
        if (this._width !== val) {
            this._width = val;
        }
    }
    get height() {
        return this._height;
    }
    set height(val) {
        if (this._height !== val) {
            this._height = val;
        }
    }
    get destroyed() {
        return this._destroyed;
    }
    set destroyed(val) {
        if (this._destroyed !== val) {
            this._destroyed = val;
        }
    }
    get parent() {
        return this._parent;
    }
    set parent(p) {
        if (this._parent !== p) {
            this._parent = p;
        }
    }
    render(renderer, delta) {
        renderer.draw(this);
    }
    destroy() {
    }
    /**
     * 帧循环监听
     * @param delta 距离上一帧的时间
     * @returns {boolean} 返回false的话，不会对本对象进行渲染
     */
    onUpdate(delta) {
        return true;
    }
    _render(renderer, delta) {
        if ((!this.onUpdate || this.onUpdate(delta) !== false) && renderer.startDraw(this)) {
            renderer.transform(this);
            this.render(renderer, delta);
            renderer.endDraw(this);
        }
    }
}
