import EventDispatcher from "../event/EventDispatcher";

export default class Texture extends EventDispatcher {
  image: HTMLImageElement
  width: number = 0
  height: number = 0

  protected _instanceType: string = 'Texture'

  constructor(src?: string) {
    super()

    if (src) {
      this.load(src)
    }
  }

  load(src: string): Promise<Texture> {
    return new Promise((resolve) => {
      let _this = this
      let img = this.image = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = function() {
        img.onload = null
        _this.width = img.width
        _this.height = img.height
        resolve(_this)
      }
      img.src = src
    })
  }
}