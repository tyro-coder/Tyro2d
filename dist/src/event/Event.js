import HashObject from "../utils/HashObject";
export default class Event extends HashObject {
    constructor() {
        super();
        this._instanceType = 'Event';
    }
    destroy() {
        throw new Error("Method not implemented.");
    }
}
