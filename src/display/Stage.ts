import CanvasRenderer from "../renderer/CanvasRenderer";
import Renderer from "../renderer/Renderer";
import { RENDER_TYPE } from "../utils/Constants";
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

  constructor(
    canvas: HTMLCanvasElement,
    designWidth: number,
    designHeight: number,
    viewWidth: number = document.body.clientWidth,
    viewHeight: number = document.body.clientHeight,
    renderType: RENDER_TYPE = RENDER_TYPE.CANVAS,
  ) {
    super()

    this._initRenderer(canvas, renderType)
  }

  /**
   * 判断目标对象是否是 Stage
   * @param val 对象
   * @returns 
   */
  static isStage(val: any) {
    return val instanceof Stage
  }

  private _initRenderer(canvas: HTMLCanvasElement, renderType: RENDER_TYPE) {
    if (renderType === RENDER_TYPE.CANVAS) {
      this.renderer = new CanvasRenderer()
    }
  }
}