import Node from '../display/Node'
import Browser from "../utils/Browser";
import Handler from "../utils/Handler";
import Utils from "../utils/Utils";
import Ease from './Ease';

interface INodeProps {
  x: number,
  y: number,
  scaleX: number,
  scaleY: number,
  opacity: number,
  rotation: number,
}

interface ITweenParams {
  duration: number
  delay: number
  loop: number
  loopDelay: number
  ease: (t: number, b: number, c: number, d: number) => number
  reverse: boolean
  onStart: Handler
  onUpdate: Handler
  onComplete: Handler
}

export default class Tween {
  static tweenMap: Record<number, Tween[]> = {}

  /**
   * 添加节点的缓动实例
   * @param target 节点对象
   * @param coverBefore 是否覆盖该节点之前未完成的缓动实例
   * @returns 缓动实例
   */
  static add(target: Node, coverBefore: boolean = false): Tween {
    const tween = new Tween(target)
    const gid: number = target.$_GID || (target.$_GID = Utils.getGID());
    if (!Tween.tweenMap[gid]) {
      Tween.tweenMap[gid] = [tween];
    } else {
      if (coverBefore) Tween.clear(target);
      Tween.tweenMap[gid].push(tween);
    }
    return tween
  }

  /**
   * 清楚缓动
   * @param target 目标节点或缓动实例
   * @returns 
   */
  static clear(target: Node|Tween): typeof Tween {
    let node = target, clearTargetAll = true
    if (target instanceof Tween) {
      node = target.target
      clearTargetAll = false
    }

    const gid: number = (node as Node).$_GID
    const tweenList = Tween.tweenMap[gid]
    if (tweenList && tweenList.length > 0) {
      if (clearTargetAll) {
        tweenList.length = 0
      } else {
        const i = tweenList.indexOf(target as Tween)
        if (i > -1) tweenList.splice(i, 1)
      }
    }
    return Tween
  }

  /**
   * 清空所有的 Tween 实例
   * @returns 
   */
  static clearAll(): typeof Tween {
    Tween.tweenMap = {}
    return Tween
  }

  /**
   * 帧更新所有的 Tween 实例
   */
  static tick() {
    // console.log('更新Tween')
    // const tweenList = Tween.tweenList, len = tweenList.length
    // let tween, i

    // for (i = 0; i < len; i++) {
    //   tween = tweenList[i]
    //   if (tween && tween.tick(Browser.now)) {
    //     tweenList.splice(i, 1)
    //     i--
    //   }
    // }
    // return Tween
  }

  /** 缓动对象 */
  target: Node = null
  /** 缓动开始时的节点属性 */
  fromProps: INodeProps = null
  /** 缓动节点的目标属性 */
  toProps: INodeProps = null
  /** 缓动的持续时长，毫秒 */
  duration: number = 1000
  /** 缓动延迟时间 */
  delay: number = 0
  /** 缓动是否暂停 */
  paused: boolean = false
  /** 缓动是否反复执行 */
  reverse: boolean = false
  /** 重播次数，如果 loop=0，则表示无限循环播放 */
  loop: number = 1;
  /** 循环时需要延迟的时长，毫秒 */
  loopDelay: number = 0
  /** 缓动函数 */
  ease: (t: number, b: number, c: number, d: number) => number = Ease.linearNone
  /** 当前时间，位于 0 和 duration 之间 */
  time: number = 0
  /** 当缓动开始时的事件处理类 */
  onStart: Handler
  /** 当缓动更新时的事件处理类 */
  onUpdate: Handler
  /** 当缓动结束时的事件处理类 */
  onComplete: Handler

  /** 缓动开始时间戳 */
  private _startTime: number = 0
  /** 缓动跳到的时间，值为 0 到 duration 区间 */
  private _seekTime: number = 0
  /** 缓动暂停时间戳 */
  private _pausedTime: number = 0
  /** 缓动暂停后开始的时间戳 */
  private _pausedStartTime: number = 0
  /** 反复播放的方向标识 */
  private _reverseFlag: number = 1
  /** 已经循环的次数 */
  private _loopCount: number = 0
  /** 是否已经开始缓动 */
  private _isStart: boolean = false
  /** 是否已完成缓动动画 */
  private _isComplete: boolean = false
  /** 缓存是否循环 */
  private _isLoop: boolean = false

  constructor(target: Node) {
    this.target = target

    // 记录当前节点的缓动属性值
    this.fromProps = {
      x: target.x,
      y: target.y,
      scaleX: target.scaleX,
      scaleY: target.scaleY,
      opacity: target.opacity,
      rotation: target.rotation,
    }
  }

  public to(toProps: INodeProps, params: ITweenParams) {
    this.toProps = {
      ...toProps,
    }

    for (const key in params) {
      this[key] = params[key]
    }
  }

  public tick(now: number): boolean {
    // 判断是否暂停了
    if (this.paused) return false
    // 判断是否已完成缓动
    if (this._isComplete) return true

    // 判断是否还剩余时间进行缓动，是否循环，是否反复

    const elapsedTime = now - this._startTime - this._pausedTime + this._seekTime
    if (elapsedTime < 0) return false

    let ratio = this.ease(this._startTime, 0, 1, this.duration)
    ratio = ratio < 0 ? 0 : ratio >= 1 ? 1 : ratio

    if (this.reverse && this._isStart) {
      // 回放
      if (this._reverseFlag < 0) {
        ratio = 1 - ratio
      }
      // 继续播放
      if (ratio < 1e-7) {
        if ((this.loop > 0 && this._loopCount++ >= this.loop) || (this.loop === 0 && !this._isLoop)) {
          this._isComplete = true
        } else {
          this._startTime = Browser.now
          this._pausedTime = 0
          this._reverseFlag *= -1
        }
      }
    }

    if (!this._isStart) {
      this._isStart = true
      if (this.onStart) this.onStart.callback.call(this, this)
    }
    this.time = elapsedTime

    this._render(ratio)
    if (this.onUpdate) this.onUpdate.callback.call(this, ratio, this)

    if (ratio >= 1) {
      if (this.reverse) {
        this._startTime = Browser.now
        this._pausedTime = 0
        this._reverseFlag *= -1
      } else if (this._isLoop || this.loop > 0 && this._loopCount++ < this.loop) {
        this._startTime = Browser.now * this.loopDelay
        this._pausedTime = 0
      } else {
        this._isComplete = true
      }
    }

    return true
  }

  private _render(ratio: number) {
    const target = this.target, fromProps = this.fromProps
    for (const key in fromProps) {
      target[key] = fromProps[key] + (this.toProps[key] - this.fromProps[key]) * ratio
    }
  }
}
