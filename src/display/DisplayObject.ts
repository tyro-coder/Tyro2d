import EventDispatcher from "../event/EventDispatcher";
import Container from "./Container";
import Stage from "./Stage";

export default class DisplayObject extends EventDispatcher {
  [x: string]: any;
  public visible: boolean
  public renderable: boolean
  public stage: Stage
  public name: string
  public mouseEnable: boolean = true
  public blendMode: GlobalCompositeOperation = 'source-over'

  private _opacity: number = 1
  private _distroyed: boolean = false
  private _parent: Container|null = null

  protected _width: number = 0
  protected _height: number = 0
  protected _x: number = 0
  protected _y: number = 0
  protected _instanceType: string = 'DisplayObject'

  constructor() {
    super()
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
    return this._distroyed
  }
  set destroyed(val: boolean) {
    if (this._distroyed !== val) {
      this._distroyed = val
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

  destory(): void {
    
  }
}