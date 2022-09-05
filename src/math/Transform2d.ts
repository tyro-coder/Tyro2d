import HashObject from "../utils/HashObject";
import Matrix2d from "./Matrix2d";

export default class Transform2d extends HashObject {
  /** 节点的宽 */
  private _width: number = 0
  /** 节点的高 */
  private _height: number = 0
  /** 旋转角度 */
  private _rotation: number = 0
  /** x轴放大倍数 */
  private _scaleX: number = 1
  /** y轴放大倍数 */
  private _scaleY: number = 1
  /** x轴位移 */
  private _x: number = 0
  /** y轴位移 */
  private _y: number = 0
  /** x轴锚点 */
  private _anchorX: number = 0
  /** y轴锚点 */
  private _anchorY: number = 0

  /** 2d矩阵 */
  private _mMatrix: Matrix2d = new Matrix2d()

  protected _instanceType: string = 'Transform2d'

  constructor() {
    super()
  }

  get matrix(): Matrix2d {
    return this._mMatrix
  }

  get width(): number {
    return this._width
  }
  set width(val: number) {
    if (this._width !== val) {
      this._width = val
      this._resetMatrix()
    }
  }

  get height(): number {
    return this._height
  }
  set height(val: number) {
    if (this._height !== val) {
      this._height = val
      this._resetMatrix()
    }
  }

  /** 旋转角度 */
  get rotation(): number {
    return this._rotation
  }
  set rotation(val: number) {
    if (this._rotation !== val) {
      this._rotation = val
    }
  }

  get scaleX(): number {
    return this._scaleX
  }
  set scaleX(val: number) {
    if (this._scaleX !== val) {
      this._scaleX = val
      this._resetMatrix()
    }
  }

  get scaleY(): number {
    return this._scaleY
  }
  set scaleY(val: number) {
    if (this._scaleY !== val) {
      this._scaleY = val
      this._resetMatrix()
    }
  }

  get anchorX(): number {
    return this._anchorX
  }
  set anchorX(val: number) {
    if (this._anchorX !== val) {
      this._anchorX = val
      this._resetMatrix()
    }
  }

  get anchorY(): number {
    return this._anchorY
  }
  set anchorY(val: number) {
    if (this._anchorY !== val) {
      this._anchorY = val
      this._resetMatrix()
    }
  }

  get x(): number {
    return this._x
  }
  set x(val: number) {
    if (this._x !== val) {
      this._x = val
      this._resetMatrix()
    }
  }

  get y(): number {
    return this._y
  }
  set y(val: number) {
    if (this._y !== val) {
      this._y = val
      this._resetMatrix()
    }
  }

  /** 刷新位置矩阵数据 */
  private _resetMatrix() {
    let  x = this.x, y = this.y
    const anchorX = this.anchorX,
      anchorY = this.anchorY,
      scaleX = this.scaleX,
      scaleY = this.scaleY,
      width = this.width,
      height = this.height

    console.log(this)

    if (anchorX !== 0) x = (x - anchorX * width)
    if (anchorY !== 0) y = (y - anchorY * height)

    this._mMatrix.set(scaleX, 0, 0, scaleY, x, y)
  }

  destroy(): void {
  }
}
