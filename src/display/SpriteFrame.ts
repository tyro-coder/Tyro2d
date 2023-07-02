import { ENGINE_OBJECT_TYPE } from '../common/constants';
import Texture from '../media/Texture';
import Sprite from './Sprite';
import Renderer from '../renderer/Renderer';

interface ISpriteFramePlayConfig {
  speed: number;
  repeat: number;
  currentFrame: number;
}

export default class SpriteFrame extends Sprite {
  private _textureList: Texture[];
  private _speed: number = 1;
  private _frame: number = 1;
  private _playing: boolean = false;
  private _repeat: number = 1;
  private _callback: (self: SpriteFrame) => void;

  protected _instanceType: string = ENGINE_OBJECT_TYPE.SpriteFrame;

  /**
   *
   * @param src 资源地址 \n
   * 如果是单个地址，则需要是精灵图集文件，同目录下必须存在同名的 .json文件 \n
   * 如果是多个地址，则表示的是每一帧的纹理资源
   * @param speed 播放速度，表示的是几帧切换一次纹理，默认为 1，即跟游戏渲染帧保持一致
   */
  constructor(src?: string[]) {
    super();

    this._loadTextureList(src);
  }

  public get textureList(): Texture[] {
    return this._textureList;
  }
  public set textureList(value: Texture[]) {
    if (this.textureList !== value) {
      this._textureList = value;
    }
  }

  /**
   * 播放动画
   * @param currentFrame 当前帧，从第几帧开始播放，默认第 1 帧
   * @param repeat 重复多少遍，为 0 一直循环，默认为 1
   * @param callback 回调
   */
  public play(
    config: ISpriteFramePlayConfig = {
      currentFrame: 1,
      repeat: 1,
      speed: 1,
    },
    callback?: (self: SpriteFrame) => void,
  ): void {
    const { currentFrame = 1, repeat = 1, speed = 1 } = config;
    this._frame = currentFrame;
    this._repeat = repeat;
    this._speed = speed;
    this._callback = callback;
    this._playing = true;
  }

  public pause(): void {
    this._playing = false;
  }

  /**
   * 加载纹理数组
   * @param srcList 纹理资源路径数组
   */
  private async _loadTextureList(srcList: string[]) {
    const _textureList = await Promise.all(srcList.map((s) => new Texture(s)));
    this._textureList = _textureList;
  }

  private _onFrame(): void {
    const len = this._textureList.length;
    if (!this._playing || len === 0) return;
    // 未超出一次帧循环
    if (this._frame <= len) {
      this.texture = this._textureList[this._frame - 1];
      this._frame++;
      return;
    }
    // 超出一次帧循环
    const nextRepeat = this._repeat - 1;
    this._frame = 1;
    if (nextRepeat > 0) {
      this._repeat--;
    } else if (nextRepeat === 0) {
      this._speed = 1;
      this._repeat = 1;
      this._playing = false;
      typeof this._callback === 'function' && this._callback(this);
    }
  }

  protected _render(renderer: Renderer, delta: number): void {
    this._onFrame();
    super._render(renderer, delta);
  }
}
