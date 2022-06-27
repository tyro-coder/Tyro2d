import EventDispatcher from "../event/EventDispatcher";
import Renderer from "../renderer/Renderer";
import Container from "./Container";
import Stage from "./Stage";

export default class DisplayObject extends EventDispatcher {
  /** 可视对象是否可见，默认为true */
  public visible: boolean = true
  /** 可视对象的名字 */
  public name: string
  /** 可视对象是否可接受交互事件 */
  public mouseEnable: boolean = true
  /** 可视对象的渲染方式 */
  public blendMode: GlobalCompositeOperation = 'source-over'

  protected _instanceType: string = 'DisplayObject'
  protected _width: number = 0
  protected _height: number = 0
  protected _x: number = 0
  protected _y: number = 0
  private _opacity: number = 1
  private _destroyed: boolean = false
  private _parent: Container|null = null

  constructor() {
    super()
  }

  get stage(): Stage|null {
    let obj: any = this.parent
    while (obj || !Stage.isStage(obj)) {
      obj = obj.parent
    }
    return obj
  }

  get opacity(): number {
    return this._opacity
  }
  set opacity(val: number) {
    if (this._opacity !== val) {
      this._opacity = val
    }
  }

  get x(): number {
    return this._x
  }
  set x(val: number) {
    if (this._x !== val) {
      this._x = val
    }
  }

  get y(): number {
    return this._y
  }
  set y(val: number) {
    if (this._y !== val) {
      this._y = val
    }
  }

  get width(): number {
    return this._width
  }
  set width(val: number) {
    if (this._width !== val) {
      this._width = val
    }
  }

  get height(): number {
    return this._height
  }
  set height(val: number) {
    if (this._height !== val) {
      this._height = val
    }
  }

  get destroyed(): boolean {
    return this._destroyed
  }
  set destroyed(val: boolean) {
    if (this._destroyed !== val) {
      this._destroyed = val
    }
  }

  get parent(): Container|null {
    return this._parent
  }
  set parent(p: Container|null) {
    if (this._parent !== p) {
      this._parent = p
    }
  }

  render(renderer: Renderer, delta: number) {
    renderer.draw(this)
  }

  destroy(): void {
    
  }

  /**
   * 帧循环监听
   * @param delta 距离上一帧的时间
   * @returns {boolean} 返回false的话，不会对本对象进行渲染
   */
  onUpdate(delta: number): boolean {
    return true
  }

  protected _render(renderer: Renderer, delta: number) {
    if ((!this.onUpdate || this.onUpdate(delta) !== false) && renderer.startDraw(this)) {
      renderer.transform(this)
      this.render(renderer, delta)
      renderer.endDraw(this)
    }
  }
}