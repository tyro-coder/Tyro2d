import EventDispatcher from '../event/EventDispatcher';

export default class Texture extends EventDispatcher {
  image: HTMLImageElement;
  width: number = 0;
  height: number = 0;
  loader: Promise<Texture>;
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
