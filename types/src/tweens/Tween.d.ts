import DisplayObject from "../display/DisplayObject";
import Handler from "../utils/Handler";
interface IDisplayObjectProps {
    ease: Function;
    complete: Handler;
    update: Handler;
}
export default class Tween {
    /**更新回调，缓动数值发生变动时，回调变化的值 */
    update: Handler;
    /**重播次数，如果 loop=0，则表示无限循环播放*/
    loop: number;
    /**@private */
    private static tweenMap;
    /**@private */
    private _complete;
    /**@private */
    private _target;
    /**@private */
    private _ease;
    /**@private */
    private _props;
    /**@private */
    private _duration;
    /**@private */
    private _delay;
    /**@private */
    private _startTimer;
    /**@private */
    private _usedTimer;
    /**@private */
    private _usedPool;
    /**@private */
    private _delayParam;
    /**当前播放次数*/
    private _count;
    static to(target: DisplayObject, props: IDisplayObjectProps, duration: number, ease?: Function | null, complete?: Handler | null, delay?: number, coverBefore?: boolean, autoRecover?: boolean): Tween;
    _create(target: DisplayObject, props: IDisplayObjectProps, duration: number, ease: Function | null, complete: Handler | null, delay: number, coverBefore: boolean, isTo: boolean, usePool: boolean, runNow: boolean): Tween;
    private firstStart;
    private _initProps;
    private _beginLoop;
    /**执行缓动**/
    private _doEase;
    /**
     * 立即结束缓动并到终点。
     */
    complete(): void;
    /**
     * 暂停缓动，可以通过resume或restart重新开始。
     */
    pause(): void;
    /**
     * 设置开始时间。
     * @param	startTime 开始时间。
     */
    setStartTime(startTime: number): void;
    /**
     * 清理指定目标对象上的所有缓动。
     * @param	target 目标对象。
     */
    static clearAll(target: any): void;
    /**
     * 清理某个缓动。
     * @param	tween 缓动对象。
     */
    static clear(tween: Tween): void;
    /**
     * 停止并清理当前缓动。
     */
    clear(): void;
    /** 回收到对象池。*/
    recover(): void;
    private _remove;
    /**
     * 重新开始暂停的缓动。
     */
    restart(): void;
    /**
     * 恢复暂停的缓动。
     */
    resume(): void;
    private static easeNone;
}
export {};
