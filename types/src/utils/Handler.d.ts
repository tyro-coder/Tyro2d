/**
 * Handler: 事件处理器类
 * 建议使用 Handler.create() 方法从对象池创建，减少对象创建消耗；
 * 创建的 Handler 对象不再使用后，可以使用 Handler.recover() 方法将其回收到对象池，回收后不要再使用此对象，否则会出现不可预料的错误；
 */
export default class Handler {
    /**@private Handler 对象池 */
    protected static _pool: Handler[];
    /**@private */
    private static _gid;
    /** 执行域(this) */
    caller: any;
    /** 回调方法 */
    callback: () => void;
    /** 参数 */
    args: any[] | null;
    /** 是否只执行一次，若为true，回调后自动执行 recover() 进行回收，回收后会被再利用，默认为 false */
    once: boolean;
    /**@private */
    protected _id: number;
    /**
     * 创建一个 Handler 类实例
     * @param caller 执行域
     * @param callback 回调函数
     * @param args 函数参数
     * @param once 是否只执行一次
     */
    constructor(caller?: any | null, callback?: () => void | null, args?: any[] | null, once?: boolean);
    /**
     * 设置此对象的属性值
     * @param caller 执行域
     * @param callback 回调函数
     * @param args 函数参数
     * @param once 是否只执行一次
     * @returns 返回 handler 本身
     */
    setTo(caller?: any | null, callback?: () => void | null, args?: any[] | null, once?: boolean): Handler;
    /**
     * 执行处理器
     * @returns 执行结果
     */
    run(): any;
    /**
     * 执行处理器，并携带额外数据
     * @param data 附加的回调数据，可以是多参，单数据或数组
     * @returns 执行结果
     */
    runWith(data: any): any;
    /**
     * 清理对象引用
     * @returns 清理后的对象
     */
    clear(): Handler;
    /**
     * 清理当前handler实例，并回收到 Handler 对象池内
     */
    recover(): void;
    /**
     * 从对象池内创建一个Handler，默认会执行一次并立即回收，如果不需要自动回收，设置 once 参数为 false
     * @param caller 执行域(this)
     * @param callback 回调方法
     * @param args 携带的参数
     * @param once 是否只执行一次，如果为true，回调后会直接回收，默认为true
     * @returns 返回创建的handler实例
     */
    static create(caller?: any | null, callback?: () => void | null, args?: any[] | null, once?: boolean): Handler;
}
