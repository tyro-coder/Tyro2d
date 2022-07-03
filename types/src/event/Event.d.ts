import HashObject from "../utils/HashObject";
export default class Event extends HashObject {
    destroy(): void;
    target: any;
    protected _instanceType: string;
    constructor();
}
