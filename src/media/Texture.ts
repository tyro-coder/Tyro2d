import EventDispatcher from '../event/EventDispatcher';

export default class Texture extends EventDispatcher {
  image: HTMLImageElement;
  width: number = 0;
  height: number = 0;
  loaded: boolean = false;

  protected _instanceType: string = 'Texture';

  constructor(src?: string) {
    super();

    if (src) {
      this.load(src);
    }
  }

  load(src: string): Promise<Texture> {
    return new Promise((resolve) => {
      const img = this.image = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        img.onload = null;
        this.width = img.naturalWidth;
        this.height = img.naturalHeight;
        this.loaded = true;
        resolve(this);
      };
      img.src = src;
    });
  }
}
