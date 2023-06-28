import { HASH_OBJECT_TYPE } from './../config/constants';
import EventDispatcher from '../event/EventDispatcher';
import Matrix2d from '../math/Matrix2d';
import Renderer from '../renderer/Renderer';
import { MathTool, Vector2d } from '../index';
import Bounds from '../physics/Bounds';

/**
 * Node 节点，所有游戏内可视元素的基类
 */
export default class Node extends EventDispatcher {
  /** 空节点数组 */
  static ARRAY_EMPTY: Node[] = [];

  public $_GID: number;
  /** 节点的背景颜色 */
  public background: string | CanvasGradient | CanvasPattern = '';
  /** 节点是否可见，默认为true */
  public visible: boolean = true;
  /** 节点的名字 */
  public name: string;
  /** 节点是否可接受鼠标或触控交互事件 */
  public mouseEnable: boolean = true;
  /** 是否裁剪超出容器范围的子元素，默认 false */
  public clipChildren: boolean = false;
  /** 节点的渲染方式 */
  public blendMode: GlobalCompositeOperation = 'source-over';

  /** 节点实例类型 */
  protected _instanceType: string = HASH_OBJECT_TYPE.Node;
  /** 节点x轴位置 */
  protected _x: number = 0;
  /** 节点y轴位置 */
  protected _y: number = 0;
  /** 节点宽度 */
  protected _width: number = 0;
  /** 节点高度 */
  protected _height: number = 0;
  /** 节点旋转角度 */
  protected _rotation: number = 0;
  /** 节点x轴缩放比例 */
  protected _scaleX: number = 1;
  /** 节点y轴缩放比例 */
  protected _scaleY: number = 1;
  /** 节点x轴锚点 */
  protected _anchorX: number = 0;
  /** 节点y轴锚点 */
  protected _anchorY: number = 0;
  /** 节点透明度，0~1 */
  protected _opacity: number = 1;
  /** 节点深度 */
  protected _zIndex: number = 0;
  /** 节点是否已销毁 */
  protected _destroyed: boolean = false;
  /** 父节点 */
  protected _parent: Node | null = null;
  /** 节点的变换实例 */
  protected _transform: Matrix2d;
  /** 子对象集合 */
  protected _children: Node[] = Node.ARRAY_EMPTY;

  constructor() {
    super();

    this._transform = Matrix2d.EMPTY;
  }

  /** 透明度 */
  get opacity(): number {
    return this._opacity;
  }
  set opacity(val: number) {
    if (this._opacity !== val) {
      this._opacity = val;
    }
  }
  /** 相对父容器的x轴偏移量 */
  get x(): number {
    return this._x;
  }
  set x(val: number) {
    if (this._x !== val) {
      this._x = val;
    }
  }
  /** 相对父容器的y轴偏移量 */
  get y(): number {
    return this._y;
  }
  set y(val: number) {
    if (this._y !== val) {
      this._y = val;
    }
  }
  /**
   * 设置位置
   * @param x x轴相对父容器偏移量
   * @param y y轴相对父容器偏移量
   * @returns 对象本身
   */
  public setPos(x: number, y: number): Node {
    this.x = x;
    this.y = y;
    return this;
  }
  /** 节点的宽 */
  get width(): number {
    return this._width;
  }
  set width(val: number) {
    if (this._width !== val) {
      this._width = val;
    }
  }
  /** 节点的高 */
  get height(): number {
    return this._height;
  }
  set height(val: number) {
    if (this._height !== val) {
      this._height = val;
    }
  }
  /** x轴缩放 */
  get scaleX(): number {
    return this._scaleX;
  }
  set scaleX(val: number) {
    if (this._scaleX !== val) {
      this._scaleX = val;
    }
  }
  /** y轴缩放值 */
  get scaleY(): number {
    return this._scaleY;
  }
  set scaleY(val: number) {
    if (this._scaleY !== val) {
      this._scaleY = val;
    }
  }
  /**
   * 设置缩放量
   * @param x x轴缩放倍数
   * @param y y轴缩放倍数
   * @returns 对象本身
   */
  public setScale(x: number, y: number): Node {
    this.scaleX = x;
    this.scaleY = y;
    return this;
  }
  /** 旋转角度 */
  get rotation(): number {
    return this._rotation;
  }
  set rotation(val: number) {
    if (this._rotation !== val) {
      this._rotation = val;
    }
  }
  /** 变换矩阵 */
  get transform(): Matrix2d {
    return this._transform;
  }
  /** x轴锚点 */
  get anchorX(): number {
    return this._anchorX;
  }
  set anchorX(val: number) {
    if (this._anchorX !== val) {
      this._anchorX = val;
    }
  }
  /** y轴锚点 */
  get anchorY(): number {
    return this._anchorY;
  }
  set anchorY(val: number) {
    if (this._anchorY !== val) {
      this._anchorY = val;
    }
  }
  /**
   * 设置锚点
   * @param x x轴锚点位置
   * @param y y轴锚点位置
   * @returns 对象本身
   */
  setAnchor(x: number, y: number): Node {
    this.anchorX = x;
    this.anchorY = y;
    return this;
  }
  /** 是否销毁 */
  get destroyed(): boolean {
    return this._destroyed;
  }
  set destroyed(val: boolean) {
    if (this._destroyed !== val) {
      this._destroyed = val;
    }
  }
  /** 父节点 */
  get parent(): Node | null {
    return this._parent;
  }
  set parent(p: Node | null) {
    if (this._parent !== p) {
      this._parent = p;
    }
  }
  /** 子节点数组 */
  get children(): Node[] {
    return this._children;
  }
  /** 字节点数目 */
  get childrenNum(): number {
    return this._children.length;
  }

  /** 销毁方法 */
  destroy(): void {
    // TODO: 节点销毁
    this.destroyed = true;
  }

  /**
   * 帧循环监听
   * @param delta 距离上一帧的时间
   * @returns {boolean} 返回false的话，不会对本对象进行渲染
   */
  onUpdate(delta: number): boolean {
    return true;
  }

  /**
   * 将节点添加到某个父节点上
   * @param parent 父节点
   * @param index 可选，是否指定位置
   * @returns 当前节点
   */
  addTo(parent: Node, index?: number): Node {
    if (typeof index === 'number') parent.addChildAt(this, index);
    else parent.addChild(this);
    return this;
  }

  /**
   * 添加子节点
   * @param child 可视对象
   * @returns 返回添加的节点
   */
  addChild(child: Node): Node {
    if (!child || this.destroyed || child === this) return child;
    if (child.parent === this) {
      const index: number = this.getChildIndex(child);
      if (index !== this._children.length - 1) {
        this._children.splice(index, 1);
        this._children.push(child);
        this._childChanged();
      }
    } else {
      child.parent && child.parent.removeChild(child);
      this._children === Node.ARRAY_EMPTY && (this._children = []);
      this._children.push(child);
      child.parent = this;
      this._childChanged();
    }
    return child;
  }
  /**
   * 添加子节点到指定的索引位置
   * @param child 节点对象
   * @param index 索引位置
   * @returns 返回添加的节点
   */
  addChildAt(child: Node, index: number): Node {
    if (!child || this.destroyed || child === this) return child;
    if (index >= 0 && index <= this._children.length) {
      if (child.parent === this) {
        const oldIndex: number = this.getChildIndex(child);
        this._children.splice(oldIndex, 1);
        this._children.splice(index, 0, child);
        this._childChanged();
      } else {
        child.parent && child.parent.removeChild(child);
        this._children === Node.ARRAY_EMPTY && (this._children = []);
        this._children.splice(index, 0, child);
        child.parent = this;
      }
      return child;
    } else {
      throw new Error('addChildAt: The index is out of bounds');
    }
  }
  /**
   * 批量增加子节点
   * @param ...args 无数子节点
   */
  addChildren(...args: Node[]): void {
    let i = 0;
    const n: number = args.length;
    while (i < n) {
      this.addChild(args[i++]);
    }
  }

  /**
   * 根据子节点对象，获取子节点的索引位置
   * @param child 子节点
   * @returns 子节点所在索引位置
   */
  getChildIndex(child: Node): number {
    return this._children.indexOf(child);
  }

  /**
   * 根据子节点的名字，获取子节点对象
   * @param name 子节点的名字
   * @returns 节点对象
   */
  getChildByName(name: string): Node | null {
    const children: Node[] = this._children;
    if (children) {
      for (let i = 0, n: number = children.length; i < n; i++) {
        const child: Node = children[i];
        if (!child) continue;
        if (child.name === name) return child;
      }
    }
    return null;
  }

  /**
   * 根据子节点的索引位置，获取子节点对象
   * @param index 索引位置
   * @returns 子节点
   */
  getChildAt(index: number): Node {
    return this._children[index] || null;
  }

  /**
   * 设置子节点的索引位置
   * @param child 子节点
   * @param index 新的索引
   * @returns 返回子节点本身
   */
  setChildIndex(child: Node, index: number): Node {
    const childs: Node[] = this._children;
    if (index < 0 || index >= childs.length) {
      throw new Error('setChildIndex: The index is out of bounds.');
    }

    const oldIndex: number = this.getChildIndex(child);
    if (oldIndex < 0) throw new Error('setChildIndex: node is must child of this object.');
    childs.splice(oldIndex, 1);
    childs.splice(index, 0, child);
    this._childChanged();
    return child;
  }

  /**
   * 删除子节点
   * @param child 子节点
   * @returns 被删除的节点
   */
  removeChild(child: Node): Node {
    if (!this._children) return child;
    const index: number = this._children.indexOf(child);
    return this.removeChildAt(index);
  }

  /**
   * 根据子节点名字删除对应子节点，如果找不到的话返回null
   * @param name 节点对象名字
   * @returns 被删除的节点
   */
  removeChildByName(name: string): Node | null {
    const child: Node | null = this.getChildByName(name);
    child && this.removeChild(child);
    return child;
  }

  /**
   * 根据子节点的索引位置，删除对应的子节点对象
   * @param index 节点索引位置
   * @return 被删除的节点
   */
  removeChildAt(index: number): Node {
    const child: Node = this.getChildAt(index);
    if (child) {
      this._children.splice(index, 1);
      child.parent = null;
    }
    return child;
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
      for (let i = 0, n: number = childs.length; i < n; i++) {
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
    const index: number = this.getChildIndex(oldChild);
    if (index > -1) {
      this._children.splice(index, 1, newChid);
      oldChild.parent = null;
      newChid.parent = this;
      return newChid;
    }
    return null;
  }

    /**
   * 子节点发生改变
   * @param child 子节点
   */
    protected _childChanged(child: Node = null) {
    }

  /**
   * 当前容器内是否包含指定的子节点对象
   * @param child 子节点对象
   * @returns 是否包含
   */
  contains(child: Node): boolean {
    let childTemp: Node | Node | null = child;
    if (childTemp === this) return true;
    while (childTemp) {
      if (childTemp.parent === this) return true;
      childTemp = child.parent;
    }
    return false;
  }

  /**
   * 获取串联的矩阵信息
   * @param ancestor 祖先节点
   * @returns
   */
  getConcatenatedMatrix(ancestor: Node | null = null): Matrix2d {
    const mtx = new Matrix2d();

    for (let o: Node = this; o !== ancestor && o.parent; o = o.parent) {
      let cos = 1,
sin = 0;
      const rotation = o.rotation % 360,
        { anchorX } = o,
        { anchorY } = o,
        { scaleX } = o,
        { scaleY } = o,
        { transform } = o;

        if (transform !== Matrix2d.EMPTY) {
          mtx.concat(transform);
        } else {
          if (rotation) {
            const r = rotation * MathTool.DEG_TO_RAD;
            cos = Math.cos(r);
            sin = Math.sin(r);
          }

          if (anchorX !== 0) mtx.dx -= anchorX;
          if (anchorY !== 0) mtx.dy -= anchorY;

          // TODO: 后续有对齐方案的话，加在这里

          mtx.concat(new Matrix2d(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, o.x, o.y));
        }
    }

    return mtx;
  }

  /**
   * 获取节点在舞台全局坐标系内的外接矩形
   * @returns
   */
  getBounds(): Bounds {
    const w = this.width,
h = this.height,
      mtx = this.getConcatenatedMatrix(),
      poly: Vector2d[] = [new Vector2d(0, 0), new Vector2d(w, 0), new Vector2d(w, h), new Vector2d(0, h)];
    let point: Vector2d,
vertexs: Vector2d[];

    for (let i = 0, len = poly.length; i < len; i++) {
      point = poly[i].transform(mtx, true, true);
      vertexs[i] = point;
    }
    return new Bounds(vertexs);
  }

  /**
   * 帧渲染方法
   * @param renderer 渲染器
   * @param delta 帧间隔时间
   */
  protected _render(renderer: Renderer, delta: number) {
    if ((!this.onUpdate || this.onUpdate(delta) !== false) && renderer.startDraw(this)) {
      renderer.transform(this);
      this.render(renderer, delta);
      renderer.endDraw(this);
    }
  }

  private render(renderer: Renderer, delta: number) {
    renderer.draw(this);
    const children = this.children.slice(0);
    let child: Node;
    for (let i = 0, len = children.length; i < len; i++) {
      child = children[i];
      if (child.parent === this) child._render(renderer, delta);
    }
  }
}
