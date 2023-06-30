import Browser from './Browser';

/** 定时触发类接口实现 */
export interface ITickerHandler {
  tick: (dt: number) => void;
}

/**
 * 定时器类
 */
export default class Ticker {
  /** 是否暂停 */
  private _paused: boolean = true;
  /** 预期帧率 */
  private _targetFPS: number = 0;
  /** 实际帧率 */
  private _measuredFPS: number = 0;
  /** 每帧间隔 ms */
  private _interval: number = 0;
  /** 定时器 id */
  private _intervalId: number = null;
  /** 定时器触发类数组 */
  private _tickers: ITickerHandler[] = [];
  /** 上一帧时间 ms */
  private _lastTime: number = 0;
  private _tickCount: number = 0;
  private _tickTime: number = 0;
  private _useRAF: boolean;

  constructor(fps: number = 60) {
    this._targetFPS = fps;
    this._interval = 1000 / this._targetFPS;
  }

  /**
   * 启动定时器
   * @param useRAF 是否使用 requestAnimationFrame
   * @returns
   */
  start(useRAF: boolean = true) {
    if (this._intervalId) return;
    this._lastTime = Browser.now;

    const self = this,
      interval = this._interval,
      raf = window.requestAnimationFrame || (window as any)[`${Browser.jsVendor}RequestAnimationFrame`];

    let runLoop: () => void;
    if (useRAF && raf && interval < 17) {
      this._useRAF = true;
      runLoop = function () {
        self._intervalId = raf(runLoop);
        self._tick();
      };
    } else {
      runLoop = function () {
        self._intervalId = window.setTimeout(runLoop, interval);
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
      const cancelRAF = window.cancelAnimationFrame || (window as any)[`${Browser.jsVendor}CancelAnimationFrame`];
      cancelRAF(this._intervalId);
    } else {
      window.clearTimeout(this._intervalId);
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
  addTicker(tickObj: ITickerHandler) {
    if (!tickObj || typeof tickObj.tick != 'function') {
      throw new Error('Ticker: The tick object must implement the tick method.');
    }
    this._tickers.push(tickObj);
  }

  /**
   * 移除定时器对象
   * @param tickObj 定时器对象
   */
  removeTicker(tickObj: ITickerHandler) {
    const tickers = this._tickers,
      index = tickers.indexOf(tickObj);
    if (index >= 0) {
      tickers.splice(index, 1);
    }
  }

  /**
   * 在下一帧执行
   * @param callback 回调方法
   * @returns
   */
  nextTick(callback: (dt: number) => void) {
    const self = this;
    const tickObj: ITickerHandler = {
      tick: function (dt: number) {
        self.removeTicker(tickObj);
        callback && callback(dt);
      },
    };

    self.addTicker(tickObj);
    return tickObj;
  }

  /**
   * 清空所有定时器
   */
  clear() {
    const tickers = this._tickers;
    tickers.length = 0;
  }

  /**
   * 延迟指定的时间后调用回调，类似 setTimeout
   * @param callback 回调方法
   * @param duration 延迟时间
   */
  timeout(callback: () => void, duration: number): ITickerHandler {
    const that = this;
    const targetTime = Browser.now + duration;
    const tickObj: ITickerHandler = {
      tick: function () {
        const nowTime = Browser.now;
        const dt = nowTime - targetTime;
        if (dt >= 0) {
          that.removeTicker(tickObj);
          callback();
        }
      },
    };
    that.addTicker(tickObj);
    return tickObj;
  }

  /**
   * 每隔一定的时间执行一次回调方法，类似 setInterval
   * @param callback 回调方法
   * @param duration 延时
   * @returns
   */
  interval(callback: () => void, duration: number): ITickerHandler {
    const that = this;
    let targetTime = Browser.now + duration;
    const tickObj: ITickerHandler = {
      tick: function () {
        let nowTime = Browser.now;
        const dt = nowTime - targetTime;
        if (dt >= 0) {
          if (dt < duration) {
            nowTime -= dt;
          }
          targetTime = nowTime + duration;
          callback();
        }
      },
    };
    that.addTicker(tickObj);
    return tickObj;
  }

  /**
   * 每一帧执行的方法
   * @returns
   */
  private _tick() {
    if (this._paused) return;
    const startTime = Browser.now,
      deltaTime = startTime - this._lastTime,
      tickers = this._tickers;

    // 计算真实的 fps
    if (++this._tickCount >= this._targetFPS) {
      this._measuredFPS = (1000 / (this._tickTime / this._tickCount) + 0.5) >> 0;
      this._tickCount = 0;
      this._tickTime = 0;
    } else {
      this._tickTime += startTime - this._lastTime;
    }
    this._lastTime = startTime;

    const tickersCopy = tickers.slice(0);
    for (let i = 0, len = tickersCopy.length; i < len; i++) {
      tickersCopy[i].tick(deltaTime);
    }
  }
}
