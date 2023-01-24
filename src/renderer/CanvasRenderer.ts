import { HASH_OBJECT_TYPE, RENDER_TYPE } from './../config/constants';
import Renderer from "./Renderer";
import Node from '../display/Node'
import { MathTool, Stage, Sprite } from '../index';
import Matrix2d from '../math/Matrix2d';

export default class CanvasRenderer extends Renderer {
  renderType: RENDER_TYPE = RENDER_TYPE.CANVAS
  context: CanvasRenderingContext2D

  protected _instanceType: string = HASH_OBJECT_TYPE.CanvasRenderer

  constructor(canvas: HTMLCanvasElement) {
    super()

    this.canvas = canvas
    this.context = <CanvasRenderingContext2D>this.canvas.getContext('2d')
  }

  startDraw(target: Node): boolean {
    if (target.visible && target.opacity > 0) {
      if (target.instanceType === HASH_OBJECT_TYPE.Stage) {
        this.context.clearRect(0, 0, target.width, target.height)
      }
      if (target.blendMode !== this.blendMode) {
        this.context.globalCompositeOperation = this.blendMode = target.blendMode
      }
      this.context.save()
      return true
    }
    return false
  }

  draw(target: Node): void {
    const ctx = this.context,
      w = target.width,
      h = target.height;

    // 绘制节点背景色，默认节点背景色为空
    if (target.background) {
      ctx.fillStyle = target.background
      ctx.fillRect(0, 0, w, h)
    }

    if (target.instanceType === HASH_OBJECT_TYPE.Sprite) {
      const sprite = target as Sprite
      const img = sprite.texture.image,
        sw = sprite.texture.width,
        sh = sprite.texture.height;
      if (img && sprite.texture.loaded) {
        ctx.drawImage(img, 0, 0, sw, sh)
      }
    }
  }

  endDraw(target: Node): void {
    this.context.restore()
  }

  transform(target: Node): void {
    const ctx = this.context,
      transform = target.transform,
      x = target.x,
      y = target.y,
      rotation = target.rotation % 360,
      anchorX = target.anchorX,
      anchorY = target.anchorY,
      scaleX = target.scaleX,
      scaleY = target.scaleY

    if (target.instanceType === 'Stage') {
      const stage = target as Stage
      const style = this.canvas.style,
        oldScaleX = stage.prevScaleX,
        oldScaleY = stage.prevScaleY;
      let isStyleChange = false;
      if (oldScaleX && oldScaleX !== scaleX) {
        stage.prevScaleX = scaleX
        style.width = scaleX * stage.width + 'px'
        isStyleChange = true
      }
      if (oldScaleY && oldScaleY !== scaleY) {
        stage.prevScaleY = scaleY
        style.height = scaleY * stage.height + 'px'
        isStyleChange = true
      }
      if (isStyleChange) {
        stage.updateViewport();
      }
    } else {
      // TODO: 添加 mask

      // TODO: 对齐方式

      if (transform !== Matrix2d.EMPTY) {
        ctx.transform(transform.a, transform.b, transform.c, transform.d, transform.dx, transform.dy)
      } else {
        if (x !== 0 || y !== 0) ctx.translate(x, y)
        if (rotation !== 0) ctx.rotate(rotation * MathTool.DEG_TO_RAD)
        if (scaleX !== 1 || scaleY !== 1) ctx.scale(scaleX, scaleY)
        if (anchorX !== 0 || anchorY !== 0) ctx.translate(-anchorX, -anchorY)
      }
    }

    if (target.opacity > 0) ctx.globalAlpha *= target.opacity
  }

  remove(target: Node): void {

  }

  clear(x: number, y: number, width: number, height: number): void {
    this.context.clearRect(x, y, width, height)
  }

  resize(width: number, height: number): void {
    
  }
}
