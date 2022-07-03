import DisplayObject from "./DisplayObject";
export default class Sprite extends DisplayObject {
    constructor() {
        super(...arguments);
        this._instanceType = 'Sprite';
    }
}
