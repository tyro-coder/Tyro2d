import { RENDER_TYPE } from './../utils/Constants';
import Renderer from "./Renderer";
import Node from '../display/Node'

export default class CanvasRenderer extends Renderer {
  renderType: RENDER_TYPE = RENDER_TYPE.CANVAS
  context: CanvasRenderingContext2D

  protected _instanceType: string = 'CanvasRenderer'

  constructor(canvas: HTMLCanvasElement) {
    super()

    this.canvas = canvas
    this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d')
  }

  startDraw(target: Node): boolean {
    if (target.visible && target.opacity > 0) {
      if (target.blendMode !== this.blendMode) {
        this.context.globalCompositeOperation = this.blendMode = target.blendMode
      }
      this.context.save()
      return true
    }
    return false
  }

  draw(target: Node): void {
    // const ctx = this.context,
    //   w = target.width,
    //   h = target.height

    // // 绘制舞台背景颜色
    // if (target instanceof Stage) {
    //   const bg = target.background
    //   if (bg) {
    //     ctx.fillStyle = bg
    //     ctx.fillRect(0, 0, w, h)
    //   }
    // }

    // // if (target instanceof Sprite) {
    // //   const texture = target.texture
    // //   const img = texture.image, imgW = texture.width, imgH = texture.height

    // //   if (!img || !imgW || !imgH) return

    // //   ctx.drawImage(img, target.x, target.y, imgW, imgH)
    // // }
  }

  endDraw(target: Node): void {
    this.context.restore()
  }

  transform(target: Node): void {
    const ctx = this.context,
      matrix = target.transform.matrix,
      x = target.x,
      y = target.y,
      rotation = target.rotation % 360,
      anchorX = target.anchorX,
      anchorY = target.anchorY,
      scaleX = target.scaleX,
      scaleY = target.scaleY


    if (matrix) {
      ctx.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.dx, matrix.dy)
    } else {
      if (x !== 0 || y !== 0) ctx.translate(x, y)
      if (rotation !== 0) ctx.rotate(rotation * Math.PI / 180)
      if (scaleX !== 1 || scaleY !== 1) ctx.scale(scaleX, scaleY)
      if (anchorX !== 0 || anchorY !== 0) ctx.translate(-anchorX, -anchorY)
    }
  }

  remove(target: Node): void {

  }

  clear(x: number, y: number, width: number, height: number): void {
    this.context.clearRect(x, y, width, height)
  }

  resize(width: number, height: number): void {
    
  }
}
