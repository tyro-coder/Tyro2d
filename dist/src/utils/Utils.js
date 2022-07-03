import Browser from "./Browser";
export default class Utils {
    /**获取一个全局唯一ID。*/
    static getGID() {
        return Utils._gid++;
    }
    /**
     * 获取DOM元素在页面中的内容显示区域
     * @param ele DOM元素
     * @returns DOM元素的可视区域，格式为 {x: 0, y: 0, width: 100, height: 100}
     */
    static getElementViewRect(ele) {
        let bounds;
        try {
            bounds = ele.getBoundingClientRect();
        }
        catch (error) {
            bounds = {
                top: ele.offsetTop,
                left: ele.offsetLeft,
                right: ele.offsetLeft + ele.offsetWidth,
                bottom: ele.offsetTop + ele.offsetHeight,
            };
        }
        const offsetX = ((Browser.win.pageXOffset || Browser.docElem.scrollLeft) - (Browser.docElem.clientLeft || 0)) || 0;
        const offsetY = ((Browser.win.pageYOffset || Browser.docElem.scrollTop) - (Browser.docElem.clientTop || 0)) || 0;
        const styles = Browser.win.getComputedStyle ? getComputedStyle(ele) : ele.style;
        const parseIntFn = Browser.win.parseInt;
        const padLeft = (parseIntFn(styles.paddingLeft) + parseIntFn(styles.borderLeftWidth)) || 0;
        const padTop = (parseIntFn(styles.paddingTop) + parseIntFn(styles.borderTopWidth)) || 0;
        const padRight = (parseIntFn(styles.paddingRight) + parseIntFn(styles.borderRightWidth)) || 0;
        const padBottom = (parseIntFn(styles.paddingBottom) + parseIntFn(styles.borderBottomWidth)) || 0;
        const top = bounds.top || 0;
        const left = bounds.left || 0;
        const right = bounds.right || 0;
        const bottom = bounds.bottom || 0;
        return {
            x: left + offsetX + padLeft,
            y: top + offsetY + padTop,
            width: right - padRight - left - padLeft,
            height: bottom - padBottom - top - padTop,
        };
    }
}
/**@private */
Utils._gid = 1;
