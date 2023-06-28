export default class Browser {
  private static _initd: boolean = false;
  /** @private */
  private static _window: Window & typeof globalThis;
  /** @private */
  private static _document: Document;
  /** 浏览器代理信息 */
  private static _userAgent: string;
  /** @private */
  private static _pixelRatio: number = -1;
  private static _jsVendor: string;
  private static _isIos: boolean = false;
  private static _isAndroid: boolean = false;

  /**
   * 获取浏览器当前时间，毫秒
   * @returns 毫秒
   */
  static get now(): number {
    return window.performance.now() || Date.now();
  }

  /**
   * 获取浏览器的全局对象 window
   * @returns Window
   */
  static get win(): Window & typeof globalThis {
    if (Browser._initd) return Browser._window;
    Browser.__init__();
    return Browser._window;
  }

  /**
   * 获取body的DOM实例
   * @returns Body Element
   */
  static get docElem(): HTMLElement {
    if (Browser._initd) return Browser._document.documentElement;
    Browser.__init__();
    return Browser._document.documentElement;
  }

  /**
   * 浏览器用户标识
   */
  static get userAgent(): string {
    if (Browser._initd) return Browser._userAgent;
    Browser.__init__();
    return Browser._userAgent;
  }

  /**
   * 是否是 IOS 系统
   */
  static get isIos(): boolean {
    if (Browser._initd) return Browser._isIos;
    Browser.__init__();
    return Browser._isIos;
  }

  /**
   * 是否是 Android 系统
   */
  static get isAndroid(): boolean {
    if (Browser._initd) return Browser._isAndroid;
    Browser.__init__();
    return Browser._isAndroid;
  }

  /**
   * 获取文档对象
   */
  static get document(): Document {
    if (Browser._initd) return Browser._document;
    Browser.__init__();
    return Browser._document;
  }

  /** 获得设备像素比。 */
  static get pixelRatio(): number {
    if (Browser._pixelRatio < 0) {
        Browser.__init__();
        if (Browser.userAgent.indexOf('Mozilla/6.0(Linux; Android 6.0; HUAWEI NXT-AL10 Build/HUAWEINXT-AL10)') > -1) Browser._pixelRatio = 2;
        else {
            Browser._pixelRatio = (Browser._window.devicePixelRatio || 1);
            if (Browser._pixelRatio < 1) Browser._pixelRatio = 1;
        }
    }
    return Browser._pixelRatio;
  }

  /** 浏览器厂商CSS前缀的js值 */
  static get jsVendor(): string {
    if (Browser._initd) return Browser._jsVendor;
    Browser.__init__();
    return Browser._jsVendor;
  }

  static __init__(): Window {
    if (Browser._initd) return Browser._window;
    const win: Window = Browser._window = window;
    const doc: Document = Browser._document = win.document;
    const ua: string = Browser._userAgent = win.navigator.userAgent;
    const maxTouchPoints: number = win.navigator.maxTouchPoints || 0;
    const { platform } = win.navigator;

    Browser._isIos = /iphone|ipad|ipod/i.test(ua);
    Browser._isAndroid = /android/i.test(ua);

    const jsVendorMap: any = {
      webkit: /webkit/i.test(ua) || /firefox/i.test(ua),
      o: /opera/i.test(ua),
    };
    Browser._jsVendor = Object.keys(jsVendorMap).find(key => jsVendorMap[key]) || '';

    Browser._initd = true;
    return Browser._window;
  }
}
