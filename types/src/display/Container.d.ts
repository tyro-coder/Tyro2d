import DisplayObject from "./DisplayObject";
export default class Container extends DisplayObject {
    /** 是否裁剪超出容器范围的子元素，默认 false */
    clipChildren: boolean;
    /**@private */
    protected static ARRAY_EMPTY: any[];
    constructor();
    get children(): any[];
    get childrenNum(): number;
    /**
     * 添加子节点
     * @param child 可视对象
     * @returns 返回添加的节点
     */
    addChild(child: DisplayObject): DisplayObject;
    /**
     * 添加子节点到指定的索引位置
     * @param child 节点对象
     * @param index 索引位置
     * @returns 返回添加的节点
     */
    addChildAt(child: DisplayObject, index: number): DisplayObject;
    /**
     * 批量增加子节点
     * @param ...args 无数子节点
     */
    addChildren(...args: any[]): void;
    /**
     * 根据子节点对象，获取子节点的索引位置
     * @param child 子节点
     * @returns 子节点所在索引位置
     */
    getChildIndex(child: DisplayObject): number;
    /**
     * 根据子节点的名字，获取子节点对象
     * @param name 子节点的名字
     * @returns 节点对象
     */
    getChildByName(name: string): DisplayObject | null;
    /**
     * 根据子节点的索引位置，获取子节点对象
     * @param index 索引位置
     * @returns 子节点
     */
    getChildAt(index: number): DisplayObject;
    /**
     * 设置子节点的索引位置
     * @param child 子节点
     * @param index 新的索引
     * @returns 返回子节点本身
     */
    setChildIndex(child: DisplayObject, index: number): DisplayObject;
    /**
     * 删除子节点
     * @param child 子节点
     * @returns 被删除的节点
     */
    removeChild(child: DisplayObject): DisplayObject;
    /**
     * 根据子节点名字删除对应子节点，如果找不到的话返回null
     * @param name 节点对象名字
     * @returns 被删除的节点
     */
    removeChildByName(name: string): DisplayObject | null;
    /**
     * 根据子节点的索引位置，删除对应的子节点对象
     * @param index 节点索引位置
     * @return 被删除的节点
     */
    removeChildAt(index: number): DisplayObject;
    /**
     * 删除指定索引区间的所有子对象
     * @param beginIndex 开始索引
     * @param endIndex 索引
     * @returns 当前节点对象
     */
    removeChildren(beginIndex?: number, endIndex?: number): Container;
    /**
     * 替换子节点
     * @param newChid 新节点
     * @param oldChild 老节点
     * @returns 返回新节点
     */
    replaceChild(newChid: DisplayObject, oldChild: DisplayObject): DisplayObject | null;
    /**
     * 当前容器内是否包含指定的子节点对象
     * @param child 子节点对象
     * @returns 是否包含
     */
    contains(child: DisplayObject): boolean;
    /**
     * 子节点发生改变
     * @param child 子节点
     */
    protected _childChanged(child?: DisplayObject | null): void;
}
