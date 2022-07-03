import { IViewPort } from "./Constants";
export default class Utils {
    /**@private */
    private static _gid;
    /**获取一个全局唯一ID。*/
    static getGID(): number;
    /**
     * 获取DOM元素在页面中的内容显示区域
     * @param ele DOM元素
     * @returns DOM元素的可视区域，格式为 {x: 0, y: 0, width: 100, height: 100}
     */
    static getElementViewRect(ele: HTMLElement): IViewPort;
}
