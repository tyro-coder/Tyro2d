import EventDispatcher from "../event/EventDispatcher";
import Renderer from "../renderer/Renderer";
import { RENDER_TYPE } from "../utils/Constants";

/**
 * Node 节点，所有游戏内元素的基类
 */
export default class Node extends EventDispatcher {
  /**@private */
  protected static ARRAY_EMPTY: Node[] = []
  public $_GID: number
  /** 节点是否可见，默认为true */
  public visible: boolean = true
  /** 节点的名字 */
  public name: string
  /** 节点是否可接受交互事件 */
  public mouseEnable: boolean = true
  /** 是否裁剪超出容器范围的子元素，默认 false */
  public clipChildren: boolean = false
  /** 节点的渲染方式 */
  public blendMode: GlobalCompositeOperation = 'source-over'
  /** 节点的渲染方法 */
  public render: (renderer: Renderer, delta: number) => void

  protected _instanceType: string = 'Node'
  protected _width: number = 0
  protected _height: number = 0
  protected _x: number = 0
  protected _y: number = 0
  private _opacity: number = 1
  private _destroyed: boolean = false
  private _parent: Node | null = null
  /**@internal 子对象集合 */
  private _children: Node[] = Node.ARRAY_EMPTY

  constructor() {
    super()
  }

  get opacity(): number {
    return this._opacity
  }
  set opacity(val: number) {
    if (this._opacity !== val) {
      this._opacity = val
    }
  }

  get x(): number {
    return this._x
  }
  set x(val: number) {
    if (this._x !== val) {
      this._x = val
    }
  }

  get y(): number {
    return this._y
  }
  set y(val: number) {
    if (this._y !== val) {
      this._y = val
    }
  }

  get width(): number {
    return this._width
  }
  set width(val: number) {
    if (this._width !== val) {
      this._width = val
    }
  }

  get height(): number {
    return this._height
  }
  set height(val: number) {
    if (this._height !== val) {
      this._height = val
    }
  }

  get destroyed(): boolean {
    return this._destroyed
  }
  set destroyed(val: boolean) {
    if (this._destroyed !== val) {
      this._destroyed = val
    }
  }

  get parent(): Node | null {
    return this._parent
  }
  set parent(p: Node | null) {
    if (this._parent !== p) {
      this._parent = p
    }
  }

  get children(): Node[] {
    return this._children
  }

  get childrenNum(): number {
    return this._children.length
  }

  destroy(): void {

  }

  /**
   * 帧循环监听
   * @param delta 距离上一帧的时间
   * @returns {boolean} 返回false的话，不会对本对象进行渲染
   */
  onUpdate(delta: number): boolean {
    return true
  }

  /**
   * 添加子节点
   * @param child 可视对象
   * @returns 返回添加的节点
   */
  addChild(child: Node): Node {
    if (!child || this.destroyed || child === this) return child
    if (child.parent === this) {
      const index: number = this.getChildIndex(child)
      if (index !== this._children.length - 1) {
        this._children.splice(index, 1)
        this._children.push(child)
        this._childChanged()
      }
    } else {
      child.parent && child.parent.removeChild(child)
      this._children === Node.ARRAY_EMPTY && (this._children = [])
      this._children.push(child)
      child.parent = this
      this._childChanged()
    }
    return child
  }

  /**
   * 添加子节点到指定的索引位置
   * @param child 节点对象
   * @param index 索引位置
   * @returns 返回添加的节点
   */
  addChildAt(child: Node, index: number): Node {
    if (!child || this.destroyed || child === this) return child
    if (index >= 0 && index <= this._children.length) {
      if (child.parent === this) {
        const oldIndex: number = this.getChildIndex(child)
        this._children.splice(oldIndex, 1)
        this._children.splice(index, 0, child)
        this._childChanged()
      } else {
        child.parent && child.parent.removeChild(child)
        this._children === Node.ARRAY_EMPTY && (this._children = [])
        this._children.splice(index, 0, child)
        child.parent = this
      }
      return child
    } else {
      throw new Error('addChildAt: The index is out of bounds')
    }
  }

  /**
   * 批量增加子节点
   * @param ...args 无数子节点
   */
  addChildren(...args: any[]): void {
    let i: number = 0
    const n: number = args.length;
    while (i < n) {
      this.addChild(args[i++])
    }
  }

  /**
   * 根据子节点对象，获取子节点的索引位置
   * @param child 子节点
   * @returns 子节点所在索引位置
   */
  getChildIndex(child: Node): number {
    return this._children.indexOf(child)
  }

  /**
   * 根据子节点的名字，获取子节点对象
   * @param name 子节点的名字
   * @returns 节点对象
   */
  getChildByName(name: string): Node | null {
    const children: any[] = this._children
    if (children) {
      for (let i: number = 0, n: number = children.length; i < n; i++) {
        const child: Node = children[i]
        if (!child) continue
        if (child.name === name) return child
      }
    }
    return null
  }

  /**
   * 根据子节点的索引位置，获取子节点对象
   * @param index 索引位置
   * @returns 子节点
   */
  getChildAt(index: number): Node {
    return this._children[index] || null
  }

  /**
   * 设置子节点的索引位置
   * @param child 子节点
   * @param index 新的索引
   * @returns 返回子节点本身
   */
  setChildIndex(child: Node, index: number): Node {
    const childs: any[] = this._children
    if (index < 0 || index >= childs.length) {
      throw new Error('setChildIndex: The index is out of bounds.')
    }

    const oldIndex: number = this.getChildIndex(child)
    if (oldIndex < 0) throw new Error('setChildIndex: node is must child of this object.')
    childs.splice(oldIndex, 1)
    childs.splice(index, 0, child)
    this._childChanged()
    return child
  }

  /**
   * 删除子节点
   * @param child 子节点
   * @returns 被删除的节点
   */
  removeChild(child: Node): Node {
    if (!this._children) return child
    const index: number = this._children.indexOf(child)
    return this.removeChildAt(index)
  }

  /**
   * 根据子节点名字删除对应子节点，如果找不到的话返回null
   * @param name 节点对象名字
   * @returns 被删除的节点
   */
  removeChildByName(name: string): Node | null {
    const child: Node | null = this.getChildByName(name)
    child && this.removeChild(child)
    return child
  }

  /**
   * 根据子节点的索引位置，删除对应的子节点对象 
   * @param index 节点索引位置
   * @return 被删除的节点
   */
  removeChildAt(index: number): Node {
    const child: Node = this.getChildAt(index)
    if (child) {
      this._children.splice(index, 1)
      child.parent = null
    }
    return child
  }

  /**
   * 删除指定索引区间的所有子对象
   * @param beginIndex 开始索引
   * @param endIndex 索引
   * @returns 当前节点对象
   */
  removeChildren(beginIndex: number = 0, endIndex: number = 0x7fffffff): Node {
    if (this._children && this._children.length > 0) {
      let childs: any[] = this._children;
      if (beginIndex === 0 && endIndex >= childs.length - 1) {
        this._children = Node.ARRAY_EMPTY;
      } else {
        childs = childs.splice(beginIndex, endIndex - beginIndex + 1);
      }
      for (let i: number = 0, n: number = childs.length; i < n; i++) {
        childs[i].parent = null;
      }
    }
    return this;
  }

  /**
   * 替换子节点
   * @param newChid 新节点
   * @param oldChild 老节点
   * @returns 返回新节点
   */
  replaceChild(newChid: Node, oldChild: Node): Node | null {
    const index: number = this.getChildIndex(oldChild)
    if (index > -1) {
      this._children.splice(index, 1, newChid)
      oldChild.parent = null
      newChid.parent = this
      return newChid
    }
    return null
  }

  /**
   * 当前容器内是否包含指定的子节点对象
   * @param child 子节点对象
   * @returns 是否包含
   */
  contains(child: Node): boolean {
    let childTemp: Node | Node | null = child
    if (childTemp === this) return true
    while (childTemp) {
      if (childTemp.parent === this) return true
      childTemp = child.parent
    }
    return false
  }

  protected _render(renderer: Renderer, delta: number) {
    this._setRenderMethod(renderer)
    if ((!this.onUpdate || this.onUpdate(delta) !== false) && renderer.startDraw(this)) {
      renderer.transform(this)
      this.render(renderer, delta)
      renderer.endDraw(this)
    }
  }

  /**
   * 使用 Canvas 进行渲染
   * @param renderer 渲染器
   * @param delta 帧间隔时间
   */
  protected _renderCanvas(renderer: Renderer, delta: number) {
    renderer.clear(this.x, this.y, this.width, this.height)
    const children = this.children
    for (let i = 0, n = children.length; i < n; i++) {
      const child = children[i]
      child._render(renderer, delta)
    }
  }
  /**
   * 使用 WebGL 进行渲染
   * @param renderer 渲染器
   * @param delta 帧间隔时间
   */
  protected _renderWebGL(renderer: Renderer, delta: number) {
  }

  /**
   * 子节点发生改变
   * @param child 子节点
   */
  protected _childChanged(child: Node = null) {
  }

  /**
   * 根据渲染器类型，设置本节点的渲染方法
   * @param renderer 渲染器
   */
  private _setRenderMethod(renderer: Renderer) {
    if (!this.render) {
      this.render = renderer.renderType === RENDER_TYPE.WEBGL ? this._renderWebGL : this._renderCanvas
    }
  }
}