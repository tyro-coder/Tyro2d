import Handler from '../utils/Handler';
import HashObject from '../utils/HashObject';
/**
 * EventDispatcher 类是可调度事件的所有类的基类
 */
export default class EventDispatcher extends HashObject {
    constructor() {
        super();
        this._instanceType = 'EventDispatcher';
    }
    hasListener(type) {
        const listener = this._events && this._events[type];
        return !!listener;
    }
    emit(type, data = null) {
        if (!this._events || !this._events[type])
            return false;
        const listeners = this._events[type];
        if (listeners.run) {
            if (listeners.once)
                delete this._events[type];
            data != null ? listeners.runWith(data) : listeners.run();
        }
        else {
            for (let i = 0, n = listeners.length; i < n; i++) {
                const listener = listeners[i];
                if (listener) {
                    data != null ? listener.runWith(data) : listener.run();
                }
                if (!listener || listener.once) {
                    listeners.splice(i, 1);
                    i--;
                    n--;
                }
            }
            if (listeners.length === 0 && this._events && !this._events[type].run) {
                delete this._events[type];
            }
        }
        return true;
    }
    on(type, listener, caller, args = null) {
        return this._createListener(type, listener, caller, args, false);
    }
    once(type, listener, caller, args = null) {
        return this._createListener(type, listener, caller, args, true);
    }
    off(type, listener, caller, onceOnly = false) {
        if (!this._events || !this._events[type])
            return this;
        const listeners = this._events[type];
        if (listeners != null) {
            if (listeners.run) {
                if ((!caller || listeners.caller === caller)
                    && (listener == null || listeners.callback === listener)
                    && (!onceOnly || listeners.once)) {
                    delete this._events[type];
                    listeners.recover();
                }
            }
            else {
                let count = 0;
                const n = listeners.length;
                for (let i = 0; i < n; i++) {
                    const item = listeners[i];
                    if (!item) {
                        count++;
                        continue;
                    }
                    if (item
                        && (!caller || listeners.caller === caller)
                        && (listener == null || listeners.callback === listener)
                        && (!onceOnly || listeners.once)) {
                        count++;
                        listeners[i] = null;
                        item.recover();
                    }
                }
                // 如果全部移除
                if (count === n)
                    delete this._events[type];
            }
        }
        return this;
    }
    offAll(type) {
        const events = this._events;
        if (!events)
            return this;
        if (type) {
            this._recoverHandlers(events[type]);
            delete events[type];
        }
        else {
            for (const name in events) {
                this._recoverHandlers(events[name]);
            }
            this._events = null;
        }
        return this;
    }
    offAllCaller(caller) {
        if (caller && this._events) {
            for (const type in this._events) {
                this.off(type, null, caller);
            }
        }
        return this;
    }
    _createListener(type, listener, caller, args, once, offBefore = true) {
        // 移除之前相同的监听
        offBefore && this.off(type, listener, caller, once);
        const handler = EventHandler.create(caller || this, listener, args, once);
        this._events || (this._events = {});
        const events = this._events;
        if (!events[type])
            events[type] = handler;
        else {
            if (Array.isArray(events[type]))
                events[type].push(handler);
            else
                events[type] = [events[type], handler];
        }
        return this;
    }
    _recoverHandlers(arr) {
        if (!arr)
            return;
        if (arr.run) {
            arr.recover();
        }
        else {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i]) {
                    arr[i].recover();
                    arr[i] = null;
                }
            }
        }
    }
    destroy() {
    }
}
/**@private */
class EventHandler extends Handler {
    constructor(caller, callback, args, once) {
        super(caller, callback, args, once);
    }
    /**
     * @override
     */
    recover() {
        if (this._id > 0) {
            this._id = 0;
            EventHandler._pool.push(this.clear());
        }
    }
    /**
       * 从对象池内创建一个 EventHandler，默认会执行一次回收，如果不需要自动回收，设置once参数为false。
       * @param caller	执行域(this)。
       * @param callback	回调方法。
       * @param args		（可选）携带的参数。
       * @param once		（可选）是否只执行一次，如果为true，回调后执行recover()进行回收，默认为true。
       * @return 返回创建的 EventHandler 实例。
       */
    static create(caller, callback, args = null, once = true) {
        if (EventHandler._pool.length)
            return EventHandler._pool.pop().setTo(caller, callback, args, once);
        return new EventHandler(caller, callback, args, once);
    }
}
/**@private EventHandler 对象池 */
EventHandler._pool = [];
