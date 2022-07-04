import { RENDER_TYPE } from './../utils/Constants';
import Stage from "../display/Stage";
import HashObject from "../utils/HashObject";
import Node from "../display/Node";

export default abstract class Renderer extends HashObject {
  canvas: HTMLCanvasElement
  stage: Stage
  blendMode: GlobalCompositeOperation = 'source-over'
  renderType: RENDER_TYPE
  context: any

  protected _instanceType: string = 'Renderer'

  constructor() {
    super()
  }

  abstract startDraw(target: Node): boolean

  abstract endDraw(target: Node): void

  abstract transform(target: Node): void

  abstract resize(width: number, height: number): void

  abstract clear(x: number, y: number, width: number, height: number): void

  abstract remove(target: Node): void

  destroy(): void {
    
  }
}
