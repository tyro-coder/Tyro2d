import HashObject from "../utils/HashObject";
export default class Renderer extends HashObject {
    constructor() {
        super();
        this.blendMode = 'source-over';
        this.renderType = 'none';
        this._instanceType = 'Renderer';
    }
    destroy() {
    }
}
