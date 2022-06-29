import Browser from "./Browser";
import Utils from "./Utils";

export default class Timer {
  /**@private */
  static systemTimer: Timer = null;
  /** 方法id */
  static _mid: number = 1
  /** 对象池 */
  static _pool: TimerHandler[] = []

  /** 时钟缩放 */
  timeScale: number = 1
  /** 当前帧开始时间 */
  currTime: number = Browser.now
  /** 当前帧数 */
  currFrame: number = 0

  /** 两帧之间的时间间隔 */
  private _delta: number = 0
  private _map: {[key: string]: TimerHandler} = {}
  private _lastTimer: number = Browser.now
  private _handlers: TimerHandler[] = []
  private _count: number = 0
  private _tempHandlers: TimerHandler[] = []

  constructor(autoActive: boolean = true) {
    autoActive && Timer.systemTimer && Timer.systemTimer.frameLoop(1, this, this._update)
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
        handler.exeTime = delay + (useFrame ? this.currFrame : this.currTime + Browser.now - this._lastTimer)
      }
      return handler
    }

    handler = Timer._pool.length > 0 ? Timer._pool.pop() : new TimerHandler()
    handler.repeat = repeat
    handler.userFrame = useFrame
    handler.delay = delay
    handler.caller = caller
    handler.method = method
    handler.args = args
    handler.exeTime = delay + (useFrame ? this.currFrame : this.currTime + Browser.now - this._lastTimer)

    this._indexHandler(handler)
    this._handlers.push(handler)
    
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

  /**
   * 帧循环处理函数
   */
  _update(): void {
    if (this.timeScale <= 0) {
      this._lastTimer = Browser.now
      this._delta = 0
      return
    }

    let frame: number = this.currFrame = this.currFrame + this.timeScale
    let now: number = Browser.now
    this._delta = (now - this._lastTimer) * this.timeScale
    let time: number = this.currTime = this.currTime + this._delta
    this._lastTimer = now

    // 执行 handlers 里面的所有 handler
    const handlers: TimerHandler[] = this._handlers
    this._count = 0
    for (let i: number = 0; i < handlers.length; i++) {
      const handler: TimerHandler = handlers[i]
      if (typeof handler.method === 'function') {
        let t: number = handler.userFrame ? frame : time
        if (t <= handler.exeTime) continue
        
        if (handler.repeat) { // 循环的
          while (t >= handler.exeTime) {
            handler.exeTime += handler.delay
            handler.run(false)
          }
        } else {
          handler.run(true)
        }
      } else {
        this._count++
      }
    }

    if (this._count > 30 || frame % 200 === 0) this._clearHandlers()
  }

  private _clearHandlers(): void {
    const handlers: TimerHandler[] = this._handlers
    for (let i: number = 0; i < handlers.length; i++) {
      const handler: TimerHandler = handlers[i]
      if (typeof handler.method === 'function') this._tempHandlers.push(handler)
      else this._recoverHandler(handler)
    }
    this._handlers = this._tempHandlers
    handlers.length = 0
    this._tempHandlers = handlers
  }

  private _recoverHandler(handler: TimerHandler): void {
    if (this._map[handler.key] === handler) delete this._map[handler.key]
    handler.clear()
    Timer._pool.push(handler)
  }

  /**
   * 根据执行上下文和方法获取对应的 TimerHandler
   * @param caller 执行上下文
   * @param method 方法
   * @returns 
   */
  private _getHandler(caller: any, method: any): TimerHandler {
    var cid: number = caller ? caller.$_GID || (caller.$_GID =Utils.getGID()) : 0;
    var mid: number = method.$_TID || (method.$_TID = Timer._mid++);
    var key: any = cid + "_" + mid;
    return this._map[key];
  }
}

/** @private */
class TimerHandler {
  /** 唯一id */
  key: string;
  /** 是否循环往复 */
  repeat: boolean;
  /** 延迟执行时间 */
  delay: number;
  /** 根据帧数执行，否则根据时间执行 */
  userFrame: boolean;
  /** 下一次执行的时间 */
  exeTime: number;
  /** 执行上下文 */
  caller: any
  /** 回调方法 */
  method: Function;
  /** 回调方法的参数 */
  args: any[];
  /** 是否跳过帧 */
  jumpFrame: boolean;

  clear(): void {
      this.caller = null;
      this.method = null;
      this.args = null;
  }

  /**
   * 执行时钟管理者内注册的方法
   * @param withClear 是否执行后删除
   * @returns 
   */
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
