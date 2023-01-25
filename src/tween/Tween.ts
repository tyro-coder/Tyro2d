import { HASH_OBJECT_TYPE } from "../config/constants";
import Node from '../display/Node';
import Browser from "../utils/Browser";
import HashObject from "../utils/HashObject";
import Ease, { EaseFunction } from "./Ease";

export interface TargetProps {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  opacity: number;
  rotation: number;
}

export interface TweenParams {
  duration: number;
  delay: number;
  ease: EaseFunction;
  loop: boolean;
  repeat: number;
  reverse: boolean;
  onStart: (tween: Tween) => void;
  onUpdate: (ratio: number, tween: Tween) => void;
  onComplete: (tween: Tween) => void;
}

export type ReverFlagType = 'Backward' | 'Forward'

export default class Tween extends HashObject {
  static TweenList: Tween[] = []

  static tick() {
    let tween: Tween
    for (let i = 0, len = Tween.TweenList.length; i < len; i++) {
      tween = Tween.TweenList[i]
      if (tween && tween._update(Browser.now)) {
        Tween.TweenList.splice(i, 1)
        i--
      }
    }
    return Tween
  }

  static add(tween: Tween) {
    const tweens = Tween.TweenList
    if (tweens.indexOf(tween) === -1) tweens.push(tween)
    return Tween
  }

  static remove(tween: Tween) {
    const i = Tween.TweenList.indexOf(tween)
    if (i > -1) Tween.TweenList.splice(i, 1)
    return Tween
  }

  static removeAll() {
    Tween.TweenList.length = 0
    return Tween
  }

  static fromTo(target: Node, fromProps: TargetProps, toProps: TargetProps, params: TweenParams): Tween {
    const tween = new Tween(target, fromProps, toProps, params)
    tween.start()
    return tween
  }

  static from(target: Node, fromProps: TargetProps, params: TweenParams): Tween {
    return Tween.fromTo(target, fromProps, null, params)
  }

  static to(target: Node, toProps: TargetProps = null, params: TweenParams): Tween {
    return Tween.fromTo(target, null, toProps, params)
  }

  public target: Node = null
  public duration: number = 1000
  public delay: number = 0
  public paused: boolean = false
  public loop: boolean = false
  public reverse: boolean = false
  public repeat: number = 0
  public repeatDelay: number = 0
  public ease: EaseFunction = Ease.linear
  public isStart: boolean = false
  public isComplete: boolean = false
  public onStart: (tween: Tween) => void
  public onUpdate: (ratio: number, tween: Tween) => void
  public onComplete: (tween: Tween) => void

  /** 执行完之后马上接的下一个Tween */
  private _next: Tween
  /** 初始属性 */
  private _fromProps: TargetProps
  /** 目标属性 */
  private _toProps: TargetProps
  /** 开始时间 */
  private _startTime: number = 0
  /** 当前tick所在时间长度 */
  private _elapsedTime: number = 0
  /** 跳跃时间 */
  private _seekTime: number = 0
  /** 暂停时间 */
  private _pausedTime: number = 0
  /** 暂停后的开始时间 */
  private _pausedStartTime: number = 0
  /** 是否往复 */
  private _reverseFlag: number = 1
  /** 重复次数，0为无限重复 */
  private _repeatCount: number = 0

  protected _instanceType: string = HASH_OBJECT_TYPE.Tween

  constructor(target: Node, fromProps: TargetProps, toProps: TargetProps, params: TweenParams) {
    super()
    this.target = target
    this.setProps(fromProps, toProps)
    if (params) {
      typeof params.duration === 'number' && (this.duration = params.duration)
      typeof params.delay === 'number' && (this.delay = params.delay)
      typeof params.ease === 'function' && (this.ease = params.ease)
      typeof params.loop === 'boolean' && (this.loop = params.loop)
      typeof params.repeat === 'number' && (this.repeat = params.repeat)
      typeof params.reverse === 'boolean' && (this.reverse = params.reverse)
      typeof params.onStart === 'function' && (this.onStart = params.onStart)
      typeof params.onUpdate === 'function' && (this.onUpdate = params.onUpdate)
      typeof params.onComplete === 'function' && (this.onComplete = params.onComplete)
    }
  }

  setProps(fromProps: TargetProps, toProps: TargetProps): Tween {
    this._fromProps = this._toProps = {
      x: this.target.x,
      y: this.target.y,
      scaleX: this.target.scaleX,
      scaleY: this.target.scaleY,
      opacity: this.target.opacity,
      rotation: this.target.rotation,
    }
    if (fromProps) {
      this._fromProps = {
        ...this._fromProps,
        ...fromProps,
      }
    }
    if (toProps) {
      this._toProps = {
        ...this._toProps,
        ...toProps,
      }
    }
    return this
  }

  start(): Tween {
    this._startTime = Browser.now + this.delay;
    this._seekTime = 0
    this._pausedTime = 0
    this._reverseFlag = 1
    this._repeatCount = 0
    this.paused = false
    this.isStart = false
    this.isComplete = false
    Tween.add(this)
    return this
  }

  stop(): Tween {
    Tween.remove(this)
    return this
  }

  pause(): Tween {
    this.paused = true
    this._pausedStartTime = Browser.now
    return this
  }

  resume(): Tween {
    this.paused = false
    if (this._pausedStartTime) {
      this._pausedTime += Browser.now - this._pausedStartTime
    }
    this._pausedStartTime = 0
    return this
  }

  /**
   * 跳到Tween指定时间
   * @param time 指定要跳转的时间。取值范围是 0 ~ duration
   * @param pause 是否暂停
   */
  seek(time: number, pause: boolean): Tween {
    const current = Browser.now
    this._startTime = current
    this._seekTime = time
    this._pausedTime = 0
    if (pause !== undefined) this.paused = pause
    this._update(current, true)
    Tween.add(this)
    return this
  }

  link(tween: Tween): Tween {
    const delay = tween.delay, startTime = this._startTime;
    tween._startTime = startTime + this.duration + delay
    this._next = tween;
    Tween.remove(tween)
    return tween
  }

  /**
   * Tween类内部的渲染方法
   * @param elapsedTime 时间戳，指0 ~ duration 之间的时间长度
   */
  _render(elapsedTime: number) {
    const target: Node = this.target,
      fromProps = this._fromProps,
      toProps = this._toProps;
    for (const key in fromProps) {
      target[key] = this.ease(elapsedTime, fromProps[key], toProps[key] - fromProps[key], this.duration)
    }
  }

  /**
   * Tween类的内部更新方法
   * @param time 系统当前时间
   * @param forceUpdate 是否强制刷新
   * @returns boolean 返回true的话会从缓动数组里面将缓动移除
   */
  _update(time: number, forceUpdate: boolean = false): boolean {
    if (this.paused && !forceUpdate) return false;
    if (this.isComplete) return true;

    // elapsed time
    const elapsedTime = time - this._startTime - this._pausedTime + this._seekTime;
    if (elapsedTime < 0) return false;
    let ratio = elapsedTime / this.duration
    ratio = (ratio <= 0 ? 0 : ratio >= 1 ? 1 : ratio)

    // 已经开始并且要求往复执行
    if (this.reverse && this.isStart) {
      if (this._reverseFlag < 0) {
        console.log('reverseFlag < 0', elapsedTime)
        ratio = 1 - ratio
      }
      if (this._reverseFlag < 1e-7) {
        if ((this.repeat > 0 && this._repeatCount++ >= this.repeat) || (this.repeat === 0 && !this.loop)) {
          this.isComplete = true;
        } else {
          this._startTime = Browser.now
          this._pausedTime = 0
          this._reverseFlag *= -1;
        }
      }
    }

    // 开始缓动的回调
    if (!this.isStart) {
      this.setProps(this._fromProps, this._toProps)
      this.isStart = true
      if (this.onStart) {
        this.onStart.call(this, this)
      }
    }
    this._elapsedTime = elapsedTime

    // 渲染和更新回调
    this._render(elapsedTime * ratio)

    // 检查是否完成缓动
    if (ratio >= 1) {
      if (this.reverse) {
        this._startTime = Browser.now
        this._pausedTime = 0
        this._reverseFlag *= -1
      } else if (this.loop || this.repeat > 0 && this._repeatCount++ < this.repeat) {
        this._startTime = Browser.now + this.repeatDelay
        this._pausedTime = 0
      } else {
        this.isComplete = true
      }
    }

    // 下一个缓动
    const next = this._next
    if (next && next._elapsedTime <= 0) {
      const nextStartTime = next._startTime
      if (nextStartTime > 0 && nextStartTime <= time) {
        next._render(elapsedTime)
        next._elapsedTime = elapsedTime
        Tween.add(next)
      } else if (this.isComplete && (nextStartTime < 0 || nextStartTime > time)) {
        next.start()
      }
    }

    if (this.isComplete) {
      typeof this.onComplete === 'function' && this.onComplete.call(this, this)
      return true
    }

    return false
  }

  destroy(): void {
    throw new Error("Method not implemented.");
  }

}
