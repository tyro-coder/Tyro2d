import Texture from "../media/Texture";
import DisplayObject from "./DisplayObject";
export default class Sprite extends DisplayObject {
    texture: Texture;
    protected _instanceType: string;
}
