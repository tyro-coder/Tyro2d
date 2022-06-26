import Browser from "./Browser";

export default class Ticker {
  private _paused: boolean = false;
  private _targetFPS: number = 0;
  private _interval: number = 0;
  private _intervalId: number = null;
  private _tickers: ITicker[] = [];
  private _lastTime: number = 0;
  private _tickCount: number = 0;
  private _tickTime: number = 0;
  private _measuredFPS: number = 0;
  private _useRAF: Function | boolean;

  constructor(fps: number) {
    this._targetFPS = fps || 60;
    this._interval = 1000 / this._targetFPS;
  }

  /**
   * 启动定时器
   * @param useRAF 是否使用 requestAnimationFrame
   * @returns
   */
  start(useRAF: boolean = true) {
    if (this._intervalId) return;
    this._lastTime = Browser.now();

    var self = this,
      interval = this._interval,
      raf =
        window.requestAnimationFrame ||
        (<any>window)[Browser.jsVendor + "RequestAnimationFrame"];

    var runLoop: Function;
    if (useRAF && raf && interval < 17) {
      this._useRAF = true;
      runLoop = function () {
        self._intervalId = raf(runLoop);
        self._tick();
      };
    } else {
      runLoop = function () {
        self._intervalId = setTimeout(runLoop, interval);
        self._tick();
      };
    }

    this._paused = false;
    runLoop();
  }

  /**
   * 停止定时器
   */
  stop() {
    if (this._useRAF) {
      var cancelRAF =
        window.cancelAnimationFrame ||
        (<any>window)[Browser.jsVendor + "CancelAnimationFrame"];
      cancelRAF(this._intervalId);
    } else {
      clearTimeout(this._intervalId);
    }

    this._intervalId = null;
    this._lastTime = 0;
    this._paused = true;
  }

  /**
   * 暂停定时器
   */
  pause() {
    this._paused = true;
  }

  /**
   * 恢复定时器
   */
  resume() {
    this._paused = false;
  }

  /**
   * 获得测定的运行时帧率
   */
  getMeasuredFPS() {
    return Math.min(this._measuredFPS, this._targetFPS);
  }

  /**
   * 添加定时器对象
   * @param tickObj 定时器对象
   */
  addTick(tickObj: ITicker) {
    if (!tickObj || typeof tickObj.tick != "function") {
      throw new Error(
        "Ticker: The tick object must implement the tick method."
      );
    }
    this._tickers.push(tickObj);
  }

  /**
   * 移除定时器对象
   * @param tickObj 定时器对象
   */
  removeTick(tickObj: ITicker) {
    var tickers = this._tickers,
      index = tickers.indexOf(tickObj);
    if (index >= 0) {
      tickers.splice(index, 1);
    }
  }

  /**
   * 下次定时回调
   * @param callback 回调方法
   * @returns
   */
  nextTick(callback: Function) {
    var that = this;
    var tickObj: ITicker = {
      tick: function (dt: number) {
        that.removeTick(tickObj);
        callback && callback();
      },
    };

    that.addTick(tickObj);
    return tickObj;
  }

  /**
   * 延迟指定的时间后调用回调，类似 setTimeout
   * @param callback 回调方法
   * @param duration 延迟时间
   */
  timeout(callback: Function, duration: number): ITicker {
    var that = this;
    var targetTime = Browser.now() + duration;
    var tickObj: ITicker = {
      tick: function () {
        var nowTime = Browser.now();
        var dt = nowTime - targetTime;
        if (dt >= 0) {
          that.removeTick(tickObj);
          callback();
        }
      },
    };
    that.addTick(tickObj);
    return tickObj;
  }

  /**
   * 每隔一定的时间执行一次回调方法，类似 setInterval
   * @param callback 回调方法
   * @param duration 延时
   * @returns 
   */
  interval(callback: Function, duration: number): ITicker {
    var that = this;
    var targetTime = Browser.now() + duration;
    var tickObj: ITicker = {
      tick: function () {
        var nowTime = Browser.now();
        var dt = nowTime - targetTime;
        if (dt >= 0) {
          if (dt < duration) {
            nowTime -= dt;
          }
          targetTime = nowTime + duration;
          callback();
        }
      },
    };
    that.addTick(tickObj);
    return tickObj;
  }

  private _tick() {
    if (this._paused) return;
    var startTime = Browser.now(),
      deltaTime = startTime - this._lastTime,
      tickers = this._tickers;

    //calculates the real fps
    if (++this._tickCount >= this._targetFPS) {
      this._measuredFPS =
        (1000 / (this._tickTime / this._tickCount) + 0.5) >> 0;
      this._tickCount = 0;
      this._tickTime = 0;
    } else {
      this._tickTime += startTime - this._lastTime;
    }
    this._lastTime = startTime;

    var tickersCopy = tickers.slice(0);
    for (var i = 0, len = tickersCopy.length; i < len; i++) {
      tickersCopy[i].tick(deltaTime);
    }
  }
}

/**
 * 定时器对象
 */
export interface ITicker {
  tick: (dt: number) => void;
}
