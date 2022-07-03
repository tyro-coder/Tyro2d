import Renderer from "./Renderer";

import { DisplayObject, Stage } from '../index'

export default class CanvasRenderer extends Renderer {
  renderType: string = 'canvas'
  context: CanvasRenderingContext2D

  protected _instanceType: string = 'CanvasRenderer'

  constructor() {
    super()

    this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d')
  }

  startDraw(target: DisplayObject): boolean {
    if (target.visible && target.opacity > 0) {
      if (target === this.stage) {
        this.clear(0, 0, target.width, target.height)
      }
      if (target.blendMode !== this.blendMode) {
        this.context.globalCompositeOperation = this.blendMode = target.blendMode
      }
      this.context.save()

      this.context.fillStyle
      return true
    }
    return false
  }

  draw(target: DisplayObject): void {
    const ctx = this.context,
      w = target.width,
      h = target.height

    // 绘制舞台背景颜色
    if (target instanceof Stage) {
      const bg = target.background
      if (bg) {
        ctx.fillStyle = bg
        ctx.fillRect(0, 0, w, h)
      }
    }

    // if (target instanceof Sprite) {
    //   const texture = target.texture
    //   const img = texture.image, imgW = texture.width, imgH = texture.height

    //   if (!img || !imgW || !imgH) return

    //   ctx.drawImage(img, target.x, target.y, imgW, imgH)
    // }
  }

  endDraw(target: DisplayObject): void {
    this.context.restore()
  }

  transform(target: DisplayObject): void {

  }

  remove(target: DisplayObject): void {
    
  }

  clear(x: number, y: number, width: number, height: number): void {
    this.context.clearRect(x, y, width, height)
  }

  resize(width: number, height: number): void {
    
  }
}
