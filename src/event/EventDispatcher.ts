import Handler from '../utils/Handler';
import HashObject from '../utils/HashObject';

/**
 * EventDispatcher 类是可调度事件的所有类的基类
 */
export default class EventDispatcher extends HashObject {
  protected _instanceType: string = 'EventDispatcher';
  private _events: any;

  hasListener(type: string): boolean {
    const listener: any = this._events && this._events[type];
    return !!listener;
  }

  emit(type: string, data: any = null): boolean {
    if (!this._events || !this._events[type]) return false;

    const listeners: any = this._events[type];
    if (listeners.run) {
      if (listeners.once) delete this._events[type];
      data === null ? listeners.run() : listeners.runWith(data);
    } else {
      for (let i = 0, n: number = listeners.length; i < n; i++) {
        const listener: EventHandler = listeners[i];
        if (listener) {
          data === null ? listener.run() : listener.runWith(data);
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

  on(type: string, listener: () => void, caller: any, args: any[] | null = null): EventDispatcher {
    return this._createListener(type, listener, caller, args, false);
  }

  once(type: string, listener: () => void, caller: any, args: any[] | null = null): EventDispatcher {
    return this._createListener(type, listener, caller, args, true);
  }

  off(type: string, listener: () => void | null, caller: any, onceOnly: boolean = false): EventDispatcher {
    if (!this._events || !this._events[type]) return this;
    const listeners: any = this._events[type];
    if (listeners != null) {
      if (listeners.run) {
        if (
          (!caller || listeners.caller === caller) &&
          (listener == null || listeners.callback === listener) &&
          (!onceOnly || listeners.once)
        ) {
          delete this._events[type];
          listeners.recover();
        }
      } else {
        let count = 0;
        const n: number = listeners.length;
        for (let i = 0; i < n; i++) {
          const item: EventHandler = listeners[i];
          if (!item) {
            count++;
            continue;
          }
          if (
            item &&
            (!caller || listeners.caller === caller) &&
            (listener == null || listeners.callback === listener) &&
            (!onceOnly || listeners.once)
          ) {
            count++;
            listeners[i] = null;
            item.recover();
          }
        }
        // 如果全部移除
        if (count === n) delete this._events[type];
      }
    }
    return this;
  }

  offAll(type?: string): EventDispatcher {
    const events: any = this._events;
    if (!events) return this;
    if (type) {
      this._recoverHandlers(events[type]);
      delete events[type];
    } else {
      for (const name in events) {
        this._recoverHandlers(events[name]);
      }
      this._events = null;
    }
    return this;
  }

  offAllCaller(caller: any): EventDispatcher {
    if (caller && this._events) {
      for (const type in this._events) {
        this.off(type, null, caller);
      }
    }
    return this;
  }

  private _createListener(
    type: string,
    listener: () => void,
    caller: any,
    args: any[] | null,
    once: boolean,
    offBefore: boolean = true,
  ): EventDispatcher {
    // 移除之前相同的监听
    offBefore && this.off(type, listener, caller, once);

    const handler: EventHandler = EventHandler.create(caller || this, listener, args, once);
    this._events || (this._events = {});

    const events: any = this._events;
    if (events[type]) {
      if (Array.isArray(events[type])) events[type].push(handler);
      else events[type] = [events[type], handler];
    } else {
      events[type] = handler;
    }
    return this;
  }

  private _recoverHandlers(arr: any): void {
    if (!arr) return;
    if (arr.run) {
      arr.recover();
    } else {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i]) {
          arr[i].recover();
          arr[i] = null;
        }
      }
    }
  }

  destroy(): void {}
}

/** @private */
class EventHandler extends Handler {
  /** @private EventHandler 对象池 */
  protected static _pool: EventHandler[] = [];

  /**
   * @override
   */
  recover(): void {
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
  static create(caller: any, callback: () => void, args: any[] | null = null, once: boolean = true): Handler {
    if (EventHandler._pool.length) {
      return (EventHandler._pool.pop() as EventHandler).setTo(caller, callback, args, once);
    }
    return new EventHandler(caller, callback, args, once);
  }
}
