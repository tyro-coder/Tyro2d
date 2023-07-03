import EventDispatcher from '../event/EventDispatcher';

export default class Texture extends EventDispatcher {
  /** 图片资源 */
  image: HTMLImageElement;
  /** 绘制起点 x 坐标，指图片资源绘制部分的起点 */
  x: number = 0;
  /** 绘制起点 y 坐标，指图片资源绘制部分的起点 */
  y: number = 0;
  /** 绘制的宽度 */
  width: number = 0;
  /** 绘制的高度 */
  height: number = 0;
  /** 加载图片的加载器 */
  loader: Promise<Texture>;
  /** 是否加载完成 */
  loaded: boolean = false;

  protected _instanceType: string = 'Texture';

  constructor(src?: string) {
    super();

    if (src) {
      this.load(src);
    }
  }

  /**
   * 通过 src 加载地址
   * @param src 资源地址
   * @returns
   */
  load(src: string) {
    if (this.loader) return;
    this.loader = new Promise((resolve) => {
      this.image = new Image();
      const img = this.image;
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        img.onload = null;
        img.onerror = null;
        this.width = img.naturalWidth;
        this.height = img.naturalHeight;
        this.loaded = true;
        resolve(this);
      };
      img.onerror = (e) => {
        img.onload = null;
        img.onerror = null;
        console.error(e);
      };
      img.src = src;
    });
  }
}
