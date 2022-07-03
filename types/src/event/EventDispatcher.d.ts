import HashObject from '../utils/HashObject';
/**
 * EventDispatcher 类是可调度事件的所有类的基类
 */
export default class EventDispatcher extends HashObject {
    protected _instanceType: string;
    private _events;
    constructor();
    hasListener(type: string): boolean;
    emit(type: string, data?: any): boolean;
    on(type: string, listener: () => void, caller: any, args?: any[] | null): EventDispatcher;
    once(type: string, listener: () => void, caller: any, args?: any[] | null): EventDispatcher;
    off(type: string, listener: () => void | null, caller: any, onceOnly?: boolean): EventDispatcher;
    offAll(type?: string): EventDispatcher;
    offAllCaller(caller: any): EventDispatcher;
    private _createListener;
    private _recoverHandlers;
    destroy(): void;
}
