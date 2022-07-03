import DisplayObject from "./DisplayObject";

export default class Container extends DisplayObject {
  /** 是否裁剪超出容器范围的子元素，默认 false */
  clipChildren: boolean = false

  /**@internal 子对象集合 */
  private _children: any[] = Container.ARRAY_EMPTY

  /**@private */
  protected static ARRAY_EMPTY: any[] = []

  constructor() {
    super()
  }

  get children(): any[] {
    return this._children
  }

  get childrenNum(): number {
    return this._children.length
  }

  /**
   * 添加子节点
   * @param child 可视对象
   * @returns 返回添加的节点
   */
  addChild(child: DisplayObject): DisplayObject {
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
      this._children === Container.ARRAY_EMPTY && (this._children = [])
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
  addChildAt(child: DisplayObject, index: number): DisplayObject {
    if (!child || this.destroyed || child === this) return child
    if (index >= 0 && index <= this._children.length) {
      if (child.parent === this) {
        const oldIndex: number = this.getChildIndex(child)
        this._children.splice(oldIndex, 1)
        this._children.splice(index, 0, child)
        this._childChanged()
      } else {
        child.parent && child.parent.removeChild(child)
        this._children === Container.ARRAY_EMPTY && (this._children = [])
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
    while(i < n) {
      this.addChild(args[i++])
    }
  }

  /**
   * 根据子节点对象，获取子节点的索引位置
   * @param child 子节点
   * @returns 子节点所在索引位置
   */
  getChildIndex(child: DisplayObject): number {
    return this._children.indexOf(child)
  }

  /**
   * 根据子节点的名字，获取子节点对象
   * @param name 子节点的名字
   * @returns 节点对象
   */
  getChildByName(name: string): DisplayObject|null {
    const children: any[] = this._children
    if (children) {
      for (let i: number = 0, n: number = children.length; i<n; i++) {
        const child: DisplayObject = children[i]
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
  getChildAt(index: number): DisplayObject {
    return this._children[index] || null
  }

  /**
   * 设置子节点的索引位置
   * @param child 子节点
   * @param index 新的索引
   * @returns 返回子节点本身
   */
  setChildIndex(child: DisplayObject, index: number): DisplayObject {
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
  removeChild(child: DisplayObject): DisplayObject {
    if (!this._children) return child
    const index: number = this._children.indexOf(child)
    return this.removeChildAt(index)
  }

  /**
   * 根据子节点名字删除对应子节点，如果找不到的话返回null
   * @param name 节点对象名字
   * @returns 被删除的节点
   */
  removeChildByName(name: string): DisplayObject|null {
    const child: DisplayObject|null = this.getChildByName(name)
    child && this.removeChild(child)
    return child
  }

  /**
   * 根据子节点的索引位置，删除对应的子节点对象 
   * @param index 节点索引位置
   * @return 被删除的节点
   */
  removeChildAt(index: number): DisplayObject {
    const child: DisplayObject = this.getChildAt(index)
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
  removeChildren(beginIndex: number = 0, endIndex: number = 0x7fffffff): Container {
    if (this._children && this._children.length > 0) {
      let childs: any[] = this._children;
      if (beginIndex === 0 && endIndex >= childs.length - 1) {
          this._children = Container.ARRAY_EMPTY;
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
  replaceChild(newChid: DisplayObject, oldChild: DisplayObject): DisplayObject|null {
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
  contains(child: DisplayObject): boolean {
    let childTemp: DisplayObject|Container|null = child
    if (childTemp === this) return true
    while (childTemp) {
      if (childTemp.parent === this) return true
      childTemp = child.parent
    }
    return false
  }

  /**
   * 子节点发生改变
   * @param child 子节点
   */
  protected _childChanged(child: DisplayObject|null = null) {
  }
}
