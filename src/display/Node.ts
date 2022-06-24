import EventDispatcher from "../event/EventDispatcher";
import Stage from "./Stage";

export default class Node extends EventDispatcher {
  public visible: boolean
  public renderable: boolean
  public parent: Node
  public stage: Stage
  public name: string
  public mouseEnable: boolean


  private _opacity: number


  protected _width: number
  protected _height: number
  protected _x: number
  protected _y: number
  protected _instanceType: string = 'Node'

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

  destory(): void {
    
  }
}