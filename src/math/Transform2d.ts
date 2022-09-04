import HashObject from "../utils/HashObject";
import Matrix2d from "./Matrix2d";

export default class Transform2d extends HashObject {
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
  /** x轴倾斜角度 */
  private _skewX: number = 0
  /** y轴倾斜角度 */
  private _skewY: number = 0
  /** x轴锚点 */
  private _anchorX: number = 0
  /** y轴锚点 */
  private _anchorY: number = 0

  /** 2d矩阵 */
  private _mMatrix: Matrix2d

  protected _instanceType: string = 'Transform2d'

  constructor() {
    super()

    this._mMatrix = new Matrix2d()
  }

  get matrix(): Matrix2d {
    return this._mMatrix
  }

  /** 旋转角度 */
  get rotation(): number {
    return this._rotation
  }
  set rotation(val: number) {
    if (this._rotation !== val) {
      this._rotation = val
      this._mMatrix.rotate(val)
    }
  }

  get scaleX(): number {
    return this._scaleX
  }
  set scaleX(val: number) {
    if (this._scaleX !== val) {
      this._mMatrix.scale(val / this._scaleX, 1)
      this._scaleX = val
    }
  }

  get scaleY(): number {
    return this._scaleY
  }
  set scaleY(val: number) {
    if (this._scaleY !== val) {
      this._mMatrix.scale(1, val / this._scaleY)
      this._scaleY = val
    }
  }

  get anchorX(): number {
    return this._anchorX
  }
  set anchorX(val: number) {
    if (this._anchorX !== val) {
      this._mMatrix.translate((val - this._anchorX) * this.scaleX, 0)
      this._anchorX = val
    }
  }

  get anchorY(): number {
    return this._anchorY
  }
  set anchorY(val: number) {
    if (this._anchorY !== val) {
      this._mMatrix.translate(0, (val - this._anchorY) * this.scaleY)
      this._anchorY = val
    }
  }

  get x(): number {
    return this._x
  }
  set x(val: number) {
    if (this._x !== val) {
      this._mMatrix.translate(val - this._x, 0)
      this._x = val
    }
  }

  get y(): number {
    return this._y
  }
  set y(val: number) {
    if (this._y !== val) {
      this._mMatrix.translate(0, val - this._y)
      this._y = val
    }
  }

  destroy(): void {
  }
}
