import Texture from "../media/Texture"
import Renderer from "../renderer/Renderer"
import Node from "./Node"

export default class Sprite extends Node {
  private _texture: Texture

  protected _instanceType: string = 'Sprite'

  constructor(src?: string) {
    super()

    this.texture = new Texture(src)
  }

  public get texture(): Texture {
    return this._texture
  }
  public set texture(tex: Texture|string) {
    if (typeof tex === 'string') {
      this._texture = new Texture(tex)
    }
    this._texture = tex as Texture
    this.width = this._texture.width
    this.height = this._texture.height
  }

  protected _renderCanvas(renderer: Renderer, delta: number) {
    const ctx = renderer.context
    const texture = this.texture
    const img = texture.image
    this.width = texture.width, this.height = texture.height

    if (img && this.width && this.height && texture.loaded) {
      ctx.drawImage(
        img,
        -this.anchorX * this.scaleX,
        -this.anchorY * this.scaleX,
        this.width * this.scaleX,
        this.height * this.scaleY
      )
    }

    super._renderCanvas(renderer, delta)
  }

  protected _renderWebGL(renderer: Renderer, delta: number) {
    throw new Error('暂未支持 WebGL 方式渲染 Sprite')
  }
}
