import { ITicker } from "./Constants";
export default class Ticker {
    private _paused;
    private _targetFPS;
    private _interval;
    private _intervalId;
    private _tickers;
    private _lastTime;
    private _tickCount;
    private _tickTime;
    private _measuredFPS;
    private _useRAF;
    constructor(fps?: number);
    /**
     * 启动定时器
     * @param useRAF 是否使用 requestAnimationFrame
     * @returns
     */
    start(useRAF?: boolean): void;
    /**
     * 停止定时器
     */
    stop(): void;
    /**
     * 暂停定时器
     */
    pause(): void;
    /**
     * 恢复定时器
     */
    resume(): void;
    /**
     * 获得测定的运行时帧率
     */
    getMeasuredFPS(): number;
    /**
     * 添加定时器对象
     * @param tickObj 定时器对象
     */
    addTick(tickObj: ITicker): void;
    /**
     * 移除定时器对象
     * @param tickObj 定时器对象
     */
    removeTick(tickObj: ITicker): void;
    /**
     * 下次定时回调
     * @param callback 回调方法
     * @returns
     */
    nextTick(callback: () => void): ITicker;
    /**
     * 清空所有定时器
     */
    clear(): void;
    /**
     * 延迟指定的时间后调用回调，类似 setTimeout
     * @param callback 回调方法
     * @param duration 延迟时间
     */
    timeout(callback: () => void, duration: number): ITicker;
    /**
     * 每隔一定的时间执行一次回调方法，类似 setInterval
     * @param callback 回调方法
     * @param duration 延时
     * @returns
     */
    interval(callback: () => void, duration: number): ITicker;
    private _tick;
}
