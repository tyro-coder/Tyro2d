import Browser from "./Browser";
import Utils from "./Utils";

export default class Timer {
  /**@private */
  static gSysTimer: Timer = null;
  /** 方法id */
  static _mid: number = 1
  /** 时针缩放 */
  scale: number = 1
  /** 当前帧开始时间 */
  currTime: number = Browser.now()
  /** 当前帧数 */
  currFrame: number = 0


  /** 两帧之间的时间间隔 */
  private _delta: number = 0
  private _map: {[key: string]: TimerHandler} = {}
  private _lastTimer: number = Browser.now()
  private _handers: TimerHandler[] = []

  constructor(autoActive: boolean = true) {
    autoActive && Timer.gSysTimer && Timer.gSysTimer.frameLoop(1, this, this._update)
  }

  get delta(): number {
    return this._delta
  }

  /**
   * 定时执行一次。
   * @param	delay	延迟时间(单位为毫秒)。
   * @param	caller	执行域(this)。
   * @param	method	定时器回调函数。
   * @param	args	回调参数。
   * @param	coverBefore	是否覆盖之前的延迟执行，默认为 true 。
   */
  once(
    delay: number,
    caller: any,
    method: Function,
    args: any[] = null,
    coverBefore: boolean = true
  ): void {
    this._create(false, false, delay, caller, method, args, coverBefore);
  }

  /**
   * 定时重复执行。
   * @param	delay	间隔时间(单位毫秒)。
   * @param	caller	执行域(this)。
   * @param	method	定时器回调函数。
   * @param	args	回调参数。
   * @param	coverBefore	是否覆盖之前的延迟执行，默认为 true 。
   * @param	jumpFrame 时钟是否跳帧。基于时间的循环回调，单位时间间隔内，如能执行多次回调，出于性能考虑，引擎默认只执行一次，设置jumpFrame=true后，则回调会连续执行多次
   */
  loop(
    delay: number,
    caller: any,
    method: Function,
    args: any[] = null,
    coverBefore: boolean = true,
    jumpFrame: boolean = false
  ): void {
    var handler: TimerHandler = this._create(
      false,
      true,
      delay,
      caller,
      method,
      args,
      coverBefore
    );
    if (handler) handler.jumpFrame = jumpFrame;
  }

  /**
   * 定时执行一次(基于帧率)。
   * @param	delay	延迟几帧(单位为帧)。
   * @param	caller	执行域(this)。
   * @param	method	定时器回调函数。
   * @param	args	回调参数。
   * @param	coverBefore	是否覆盖之前的延迟执行，默认为 true 。
   */
  frameOnce(
    delay: number,
    caller: any,
    method: Function,
    args: any[] = null,
    coverBefore: boolean = true
  ): void {
    this._create(true, false, delay, caller, method, args, coverBefore);
  }

  /**
   * 定时重复执行(基于帧率)。
   * @param	delay	间隔几帧(单位为帧)。
   * @param	caller	执行域(this)。
   * @param	method	定时器回调函数。
   * @param	args	回调参数。
   * @param	coverBefore	是否覆盖之前的延迟执行，默认为 true 。
   */
  frameLoop(
    delay: number,
    caller: any,
    method: Function,
    args: any[] = null,
    coverBefore: boolean = true
  ): void {
    this._create(true, true, delay, caller, method, args, coverBefore);
  }

  /**
   * 立即提前执行定时器，执行之后从队列中删除
   * @param	caller 执行域(this)。
   * @param	method 定时器回调函数。
   */
  runTimer(caller: any, method: Function): void {
    var handler: TimerHandler = this._getHandler(caller, method);
    if (handler && handler.method != null) {
      this._map[handler.key] = null;
      handler.run(true);
    }
  }

  /**
   * 清理定时器。
   * @param	caller 执行域(this)。
   * @param	method 定时器回调函数。
   */
  clear(caller: any, method: Function): void {
    var handler: TimerHandler = this._getHandler(caller, method);
    if (handler) {
      handler.clear();
    }
  }

  _create(useFrame: boolean, repeat: boolean, delay: number, caller: any, method: Function, args: any[], coverBefore: boolean): TimerHandler {
    if (!delay) {
      method.apply(caller, args)
      return null
    }

    let handler: TimerHandler;
    if (coverBefore) {
      handler = this._getHandler(caller, method)
      if (handler) {
        handler.repeat = repeat
        handler.userFrame = useFrame
        handler.delay = delay
        handler.caller = caller
        handler.method = method
        handler.args = args
        handler.exeTime = delay + (useFrame ? this.currFrame : this.currTime + Browser.now() - this._lastTimer)
      }
      return handler
    }

    // TODO:后面再做优化
    handler = new TimerHandler()
    handler.repeat = repeat
    handler.userFrame = useFrame
    handler.delay = delay
    handler.caller = caller
    handler.method = method
    handler.args = args
    handler.exeTime = delay + (useFrame ? this.currFrame : this.currTime + Browser.now() - this._lastTimer)

    this._indexHandler(handler)
    this._handers.push(handler)
    
    return handler
  }

  _indexHandler(handler: TimerHandler) {
    var caller: any = handler.caller;
    var method: any = handler.method;
    var cid: number = caller ? caller.$_GID || (caller.$_GID = Utils.getGID()) : 0;
    var mid: number = method.$_TID || (method.$_TID = Timer._mid++);
    handler.key = cid + "_" + mid;
    this._map[handler.key] = handler;
  }

  _update() {

  }

  /** @private */
  private _getHandler(caller: any, method: any): TimerHandler {
    var cid: number = caller ? caller.$_GID || (caller.$_GID =Utils.getGID()) : 0;
    var mid: number = method.$_TID || (method.$_TID = Timer._mid++);
    var key: any = cid + "_" + mid;
    return this._map[key];
  }
}

/** @private */
class TimerHandler {
  key: string;
  repeat: boolean;
  delay: number;
  userFrame: boolean;
  exeTime: number;
  caller: any
  method: Function;
  args: any[];
  jumpFrame: boolean;

  clear(): void {
      this.caller = null;
      this.method = null;
      this.args = null;
  }

  run(withClear: boolean): void {
      var caller: any = this.caller;
      if (caller && caller.destroyed) return this.clear();
      var method: Function = this.method;
      var args: any[] = this.args;
      withClear && this.clear();
      if (method == null) return;
      args ? method.apply(caller, args) : method.call(caller);
  }
}
