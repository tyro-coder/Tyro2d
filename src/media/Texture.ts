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
      const img = this.image = new Image()
      img.crossOrigin = 'Anonymous'
      img.onload = () => {
        img.onload = null
        this.width = img.width
        this.height = img.height
        resolve(this)
      }
      img.src = src
    })
  }
}