import Browser from "../utils/Browser";
import Pool from "../utils/Pool";
import Utils from "../utils/Utils";
export default class Tween {
    constructor() {
        /**重播次数，如果 loop=0，则表示无限循环播放*/
        this.loop = 1;
        /**当前播放次数*/
        this._count = 0;
    }
    static to(target, props, duration, ease = null, complete = null, delay = 0, coverBefore = false, autoRecover = true) {
        return Pool.getInstanceByClass("tween", Tween)._create(target, props, duration, ease, complete, delay, coverBefore, true, autoRecover, true);
    }
    _create(target, props, duration, ease, complete, delay, coverBefore = false, isTo, usePool, runNow) {
        if (!target)
            throw new Error("Tween: target is null");
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
        var gid = target.$_GID || (target.$_GID = Utils.getGID());
        if (!Tween.tweenMap[gid]) {
            Tween.tweenMap[gid] = [this];
        }
        else {
            if (coverBefore)
                Tween.clearAll(target);
            Tween.tweenMap[gid].push(this);
        }
        if (runNow) {
            if (delay <= 0)
                this.firstStart(target, props, isTo);
            else {
                this._delayParam = [target, props, isTo];
                TimerManager.timer.once(delay, this, this.firstStart, this._delayParam);
            }
        }
        else {
            this._initProps(target, props, isTo);
        }
        return this;
    }
    firstStart(target, props, isTo) {
        this._delayParam = null;
        if (target.destroyed) {
            this.clear();
            return;
        }
        this._initProps(target, props, isTo);
        this._beginLoop();
    }
    _initProps(target, props, isTo) {
        //初始化属性
        for (var p in props) {
            if (typeof target[p] == "number") {
                var start = isTo ? target[p] : props[p];
                var end = isTo ? props[p] : target[p];
                this._props.push([p, start, end - start]);
                if (!isTo)
                    target[p] = start;
            }
        }
    }
    _beginLoop() {
        TimerManager.timer.frameLoop(1, this, this._doEase);
    }
    /**执行缓动**/
    _doEase() {
        this._updateEase(Browser.now);
    }
    /**@internal */
    _updateEase(time) {
        var target = this._target;
        if (!target)
            return;
        //如果对象被销毁，则立即停止缓动
        if (target.destroyed)
            return Tween.clearAll(target);
        var usedTimer = (this._usedTimer =
            time - this._startTimer - this._delay);
        if (usedTimer < 0)
            return;
        if (usedTimer >= this._duration)
            return this.complete();
        var ratio = usedTimer > 0 ? this._ease(usedTimer, 0, 1, this._duration) : 0;
        var props = this._props;
        for (var i = 0, n = props.length; i < n; i++) {
            var prop = props[i];
            target[prop[0]] = prop[1] + ratio * prop[2];
        }
        if (this.update)
            this.update.run();
    }
    /**
     * 立即结束缓动并到终点。
     */
    complete() {
        if (!this._target)
            return;
        // 立即执行初始化
        TimerManager.timer.runTimer(this, this.firstStart);
        // 缓存当前属性
        var target = this._target;
        var props = this._props;
        var handler = this._complete;
        // 设置终点属性
        for (var i = 0, n = props.length; i < n; i++) {
            var prop = props[i];
            target[prop[0]] = prop[1] + prop[2];
        }
        if (this.update)
            this.update.run();
        this._count++;
        if (this.loop != 0 && this._count >= this.loop) {
            // 清理
            this.clear();
            // 回调
            handler && handler.run();
        }
        else {
            this.restart();
        }
    }
    /**
     * 暂停缓动，可以通过resume或restart重新开始。
     */
    pause() {
        TimerManager.timer.clear(this, this._beginLoop);
        TimerManager.timer.clear(this, this._doEase);
        TimerManager.timer.clear(this, this.firstStart);
        var time = Browser.now;
        var dTime;
        dTime = time - this._startTimer - this._delay;
        if (dTime < 0) {
            this._usedTimer = dTime;
        }
    }
    /**
     * 设置开始时间。
     * @param	startTime 开始时间。
     */
    setStartTime(startTime) {
        this._startTimer = startTime;
    }
    /**
     * 清理指定目标对象上的所有缓动。
     * @param	target 目标对象。
     */
    static clearAll(target) {
        if (!target || !target.$_GID)
            return;
        var tweens = Tween.tweenMap[target.$_GID];
        if (tweens) {
            for (var i = 0, n = tweens.length; i < n; i++) {
                tweens[i]._clear();
            }
            tweens.length = 0;
        }
    }
    /**
     * 清理某个缓动。
     * @param	tween 缓动对象。
     */
    static clear(tween) {
        tween.clear();
    }
    /**
     * 停止并清理当前缓动。
     */
    clear() {
        if (this._target) {
            this._remove();
            this._clear();
        }
    }
    /**
     * @internal
     */
    _clear() {
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
    recover() {
        this._usedPool = true;
        this._clear();
    }
    _remove() {
        var tweens = Tween.tweenMap[this._target.$_GID];
        if (tweens) {
            for (var i = 0, n = tweens.length; i < n; i++) {
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
    restart() {
        this.pause();
        this._usedTimer = 0;
        this._startTimer = Browser.now;
        if (this._delayParam) {
            TimerManager.timer.once(this._delay, this, this.firstStart, this._delayParam);
            return;
        }
        var props = this._props;
        for (var i = 0, n = props.length; i < n; i++) {
            var prop = props[i];
            this._target[prop[0]] = prop[1];
        }
        TimerManager.timer.once(this._delay, this, this._beginLoop);
    }
    /**
     * 恢复暂停的缓动。
     */
    resume() {
        if (this._usedTimer >= this._duration)
            return;
        this._startTimer = Browser.now - this._usedTimer - this._delay;
        if (this._delayParam) {
            if (this._usedTimer < 0) {
                TimerManager.timer.once(-this._usedTimer, this, this.firstStart, this._delayParam);
            }
            else {
                this.firstStart.apply(this, this._delayParam);
            }
        }
        else {
            this._beginLoop();
        }
    }
    static easeNone(t, b, c, d) {
        return (c * t) / d + b;
    }
}
/**@private */
Tween.tweenMap = [];
