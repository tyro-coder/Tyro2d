import { ENGINE_OBJECT_TYPE } from '../common/constants';
import Texture from '../media/Texture';
import Renderer from '../renderer/Renderer';
import Node from './Node';

export default class Sprite extends Node {
  private _texture: Texture;

  protected _instanceType: string = ENGINE_OBJECT_TYPE.Sprite;

  constructor(src?: string) {
    super();
    this.texture = new Texture(src);
  }

  public get texture(): Texture {
    return this._texture;
  }
  public set texture(tex: Texture) {
    if (this._texture !== tex) {
      this._texture = tex;
      this.width = this._texture.width;
      this.height = this._texture.height;
    }
  }

  protected _render(renderer: Renderer, delta: number): void {
    // 刷新精灵图的宽高
    if (!this.width && this._texture.width) this.width = this._texture.width;
    if (!this.height && this._texture.height) this.height = this._texture.height;
    super._render(renderer, delta);
  }
}
