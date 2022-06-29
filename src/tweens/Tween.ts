import DisplayObject from "../display/DisplayObject";
import Browser from "../utils/Browser";
import Handler from "../utils/Handler";
import Pool from "../utils/Pool";
import TimerManager from "../utils/TimerManager";
import Utils from "../utils/Utils";

interface IDisplayObjectProps {
  ease: Function;
  complete: Handler;
  update: Handler;
}

export default class Tween {
  /**更新回调，缓动数值发生变动时，回调变化的值 */
  update: Handler;
  /**重播次数，如果 loop=0，则表示无限循环播放*/
  loop: number = 1;

  /**@private */
  private static tweenMap: any[] = [];
  /**@private */
  private _complete: Handler;
  /**@private */
  private _target: any;
  /**@private */
  private _ease: Function;
  /**@private */
  private _props: any[];
  /**@private */
  private _duration: number;
  /**@private */
  private _delay: number;
  /**@private */
  private _startTimer: number;
  /**@private */
  private _usedTimer: number;
  /**@private */
  private _usedPool: boolean;
  /**@private */
  private _delayParam: any[];
  /**当前播放次数*/
  private _count: number = 0;

  static to(
    target: DisplayObject,
    props: IDisplayObjectProps,
    duration: number,
    ease: Function | null = null,
    complete: Handler | null = null,
    delay: number = 0,
    coverBefore: boolean = false,
    autoRecover: boolean = true
  ): Tween {
    return Pool.getInstanceByClass("tween", Tween)._create(
      target,
      props,
      duration,
      ease,
      complete,
      delay,
      coverBefore,
      true,
      autoRecover,
      true
    );
  }

  _create(
    target: DisplayObject,
    props: IDisplayObjectProps,
    duration: number,
    ease: Function | null,
    complete: Handler | null,
    delay: number,
    coverBefore: boolean = false,
    isTo: boolean,
    usePool: boolean,
    runNow: boolean
  ): Tween {
    if (!target) throw new Error("Tween: target is null");

    this._target = target;
    this._duration = duration;
    this._ease = ease || props.ease || Tween.easeNone;
    this._complete = complete || props.complete;
    this._delay = delay;
    this._props = [];
    this._usedTimer = 0;
    this._startTimer = Browser.now;
    this._usedPool = usePool;
    this._delayParam = null;
    this.update = props.update;

    // 判断是否覆盖
    var gid: number = target.$_GID || (target.$_GID = Utils.getGID());
    if (!Tween.tweenMap[gid]) {
      Tween.tweenMap[gid] = [this];
    } else {
      if (coverBefore) Tween.clearAll(target);
      Tween.tweenMap[gid].push(this);
    }

    if (runNow) {
      if (delay <= 0) this.firstStart(target, props, isTo);
      else {
        this._delayParam = [target, props, isTo];
        TimerManager.timer.once(delay, this, this.firstStart, this._delayParam);
      }
    } else {
      this._initProps(target, props, isTo);
    }

    return this;
  }

  private firstStart(target: any, props: any, isTo: boolean): void {
    this._delayParam = null;
    if (target.destroyed) {
      this.clear();
      return;
    }
    this._initProps(target, props, isTo);
    this._beginLoop();
  }

  private _initProps(target: any, props: any, isTo: boolean): void {
    //初始化属性
    for (var p in props) {
      if (typeof target[p] == "number") {
        var start: number = isTo ? target[p] : props[p];
        var end: number = isTo ? props[p] : target[p];
        this._props.push([p, start, end - start]);
        if (!isTo) target[p] = start;
      }
    }
  }

  private _beginLoop(): void {
    TimerManager.timer.frameLoop(1, this, this._doEase);
  }

  /**执行缓动**/
  private _doEase(): void {
    this._updateEase(Browser.now);
  }

  /**@internal */
  private _updateEase(time: number): void {
    var target: any = this._target;
    if (!target) return;

    //如果对象被销毁，则立即停止缓动
    if (target.destroyed) return Tween.clearAll(target);

    var usedTimer: number = (this._usedTimer =
      time - this._startTimer - this._delay);
    if (usedTimer < 0) return;
    if (usedTimer >= this._duration) return this.complete();

    var ratio: number =
      usedTimer > 0 ? this._ease(usedTimer, 0, 1, this._duration) : 0;
    var props: any[] = this._props;
    for (var i: number = 0, n: number = props.length; i < n; i++) {
      var prop: any[] = props[i];
      target[prop[0]] = prop[1] + ratio * prop[2];
    }
    if (this.update) this.update.run();
  }

  /**
   * 立即结束缓动并到终点。
   */
  complete(): void {
    if (!this._target) return;

    // 立即执行初始化
    TimerManager.timer.runTimer(this, this.firstStart);

    // 缓存当前属性
    var target: any = this._target;
    var props: any = this._props;
    var handler: Handler = this._complete;
    // 设置终点属性
    for (var i: number = 0, n: number = props.length; i < n; i++) {
      var prop: any[] = props[i];
      target[prop[0]] = prop[1] + prop[2];
    }
    if (this.update) this.update.run();

    this._count++;
    if (this.loop != 0 && this._count >= this.loop) {
      // 清理
      this.clear();
      // 回调
      handler && handler.run();
    } else {
      this.restart();
    }
  }

  /**
   * 暂停缓动，可以通过resume或restart重新开始。
   */
  pause(): void {
    TimerManager.timer.clear(this, this._beginLoop);
    TimerManager.timer.clear(this, this._doEase);
    TimerManager.timer.clear(this, this.firstStart);
    var time: number = Browser.now;
    var dTime: number;
    dTime = time - this._startTimer - this._delay;
    if (dTime < 0) {
      this._usedTimer = dTime;
    }
  }

  /**
   * 设置开始时间。
   * @param	startTime 开始时间。
   */
  setStartTime(startTime: number): void {
    this._startTimer = startTime;
  }

  /**
   * 清理指定目标对象上的所有缓动。
   * @param	target 目标对象。
   */
  static clearAll(target: any): void {
    if (!target || !target.$_GID) return;
    var tweens: any[] = Tween.tweenMap[target.$_GID];
    if (tweens) {
      for (var i: number = 0, n: number = tweens.length; i < n; i++) {
        tweens[i]._clear();
      }
      tweens.length = 0;
    }
  }

  /**
   * 清理某个缓动。
   * @param	tween 缓动对象。
   */
  static clear(tween: Tween): void {
    tween.clear();
  }

  /**
   * 停止并清理当前缓动。
   */
  clear(): void {
    if (this._target) {
      this._remove();
      this._clear();
    }
  }

  /**
   * @internal
   */
  _clear(): void {
    this.pause();
    TimerManager.timer.clear(this, this.firstStart);
    this._complete = null;
    this._target = null;
    this._ease = null;
    this._props = null;
    this._delayParam = null;
    this.loop = 1;

    if (this._usedPool) {
      this.update = null;
      Pool.recover("tween", this);
    }
  }

  /** 回收到对象池。*/
  recover(): void {
    this._usedPool = true;
    this._clear();
  }

  private _remove(): void {
    var tweens: any[] = Tween.tweenMap[this._target.$_GID];
    if (tweens) {
      for (var i: number = 0, n: number = tweens.length; i < n; i++) {
        if (tweens[i] === this) {
          tweens.splice(i, 1);
          break;
        }
      }
    }
  }

  /**
   * 重新开始暂停的缓动。
   */
  restart(): void {
    this.pause();
    this._usedTimer = 0;
    this._startTimer = Browser.now;
    if (this._delayParam) {
      TimerManager.timer.once(this._delay, this, this.firstStart, this._delayParam);
      return;
    }
    var props: any[] = this._props;
    for (var i: number = 0, n: number = props.length; i < n; i++) {
      var prop: any[] = props[i];
      this._target[prop[0]] = prop[1];
    }
    TimerManager.timer.once(this._delay, this, this._beginLoop);
  }

  /**
   * 恢复暂停的缓动。
   */
  resume(): void {
    if (this._usedTimer >= this._duration) return;
    this._startTimer = Browser.now - this._usedTimer - this._delay;
    if (this._delayParam) {
      if (this._usedTimer < 0) {
        TimerManager.timer.once(
          -this._usedTimer,
          this,
          this.firstStart,
          this._delayParam
        );
      } else {
        this.firstStart.apply(this, this._delayParam);
      }
    } else {
      this._beginLoop();
    }
  }

  private static easeNone(t: number, b: number, c: number, d: number): number {
    return (c * t) / d + b;
  }
}
