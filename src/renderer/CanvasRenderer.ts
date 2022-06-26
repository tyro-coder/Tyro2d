import Renderer from "./Renderer";
import DisplayObject from "../display/DisplayObject";

export default class CanvasRenderer extends Renderer {
  renderType: string = 'canvas'
  context: CanvasRenderingContext2D

  protected _instanceType: string = 'CanvasRenderer'

  constructor() {
    super()

    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D
  }

  startDraw(target: DisplayObject): boolean {
    if (target.visible && target.opacity > 0) {
      if (target === this.stage) {
        this.context?.clearRect(0, 0, target.width, target.height)
      }
      if (target.blendMode !== this.blendMode) {
        this.context.globalCompositeOperation = this.blendMode = target.blendMode
      }
      this.context.save()
      return true
    }
    return false
  }

  draw(target: DisplayObject): void {
    const ctx = this.context,
      w = target.width,
      h = target.height
  }

  endDraw(target: DisplayObject): void {
    this.context.restore()
  }
}