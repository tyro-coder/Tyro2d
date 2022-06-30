import Stage from "../display/Stage";
import HashObject from "../utils/HashObject";
import DisplayObject from "../display/DisplayObject";

export default abstract class Renderer extends HashObject {
  canvas: HTMLCanvasElement
  stage: Stage
  blendMode: GlobalCompositeOperation = 'source-over'
  renderType: string = 'none'
  context: any

  protected _instanceType: string = 'Renderer'

  constructor() {
    super()
  }

  abstract startDraw(target: DisplayObject): boolean

  abstract draw(target: DisplayObject): void

  abstract endDraw(target: DisplayObject): void

  abstract transform(target: DisplayObject): void

  abstract resize(width: number, height: number): void

  abstract clear(x: number, y: number, width: number, height: number): void

  abstract remove(target: DisplayObject): void

  destroy(): void {
    
  }
}