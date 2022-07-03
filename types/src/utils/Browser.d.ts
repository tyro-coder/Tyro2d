export default class Browser {
    private static _initd;
    /** @private */
    private static _window;
    /** @private */
    private static _document;
    /** 浏览器代理信息 */
    private static _userAgent;
    /** @private */
    private static _pixelRatio;
    private static _jsVendor;
    private static _isIos;
    private static _isAndroid;
    /**
     * 获取浏览器当前时间，毫秒
     * @returns 毫秒
     */
    static get now(): number;
    /**
     * 获取浏览器的全局对象 window
     * @returns Window
     */
    static get win(): Window & typeof globalThis;
    /**
     * 获取body的DOM实例
     * @returns Body Element
     */
    static get docElem(): HTMLElement;
    /**
     * 浏览器用户标识
     */
    static get userAgent(): string;
    /**
     * 是否是 IOS 系统
     */
    static get isIos(): boolean;
    /**
     * 是否是 Android 系统
     */
    static get isAndroid(): boolean;
    /**
     * 获取文档对象
     */
    static get document(): Document;
    /** 获得设备像素比。*/
    static get pixelRatio(): number;
    /** 浏览器厂商CSS前缀的js值 */
    static get jsVendor(): string;
    static __init__(): Window;
}
