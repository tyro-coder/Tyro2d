import Browser from '../utils/Browser';

export default class ImageLoader {
  load(src: string) {
    const image = new window.Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      this.onLoad(image);
    };
    const _onError = this.onError.bind(image);
    image.onabort = _onError;
    image.onerror = _onError;
    image.src = `${src + (src.indexOf('?') === -1 ? '?' : '&')}t=${Browser.now}`;
  }

  onLoad(image: HTMLImageElement): HTMLImageElement {
    image.onload = null;
    image.onerror = null;
    image.onabort = null;
    return image;
  }

  onError(e: Event): Event {
    const image = e.target as HTMLImageElement;
    image.onload = null;
    image.onerror = null;
    image.onabort = null;
    return e;
  }
}
