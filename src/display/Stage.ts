import Renderer from "../renderer/Renderer";
import Container from "./Container";

export interface IViewPort {
  left: number
  top: number
  width: number
  height: number
}

export default class Stage extends Container {
  canvas: HTMLCanvasElement
  renderer: Renderer
  paused: boolean = false
  viewport: IViewPort

  protected _instanceType: string = 'Stage'

  constructor() {
    super()
  }
}