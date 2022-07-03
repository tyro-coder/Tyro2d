import Renderer from "./Renderer";
import DisplayObject from "../display/DisplayObject";
export default class CanvasRenderer extends Renderer {
    renderType: string;
    context: CanvasRenderingContext2D;
    protected _instanceType: string;
    constructor();
    startDraw(target: DisplayObject): boolean;
    draw(target: DisplayObject): void;
    endDraw(target: DisplayObject): void;
    transform(target: DisplayObject): void;
    remove(target: DisplayObject): void;
    clear(x: number, y: number, width: number, height: number): void;
    resize(width: number, height: number): void;
}
