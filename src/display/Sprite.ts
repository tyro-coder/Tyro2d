import { HASH_OBJECT_TYPE } from './../config/constants';
import Texture from "../media/Texture"
import Renderer from "../renderer/Renderer"
import Node from "./Node"

export default class Sprite extends Node {
  private _texture: Texture

  protected _instanceType: string = HASH_OBJECT_TYPE.Sprite

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
}
