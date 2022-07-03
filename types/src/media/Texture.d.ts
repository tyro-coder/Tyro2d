import EventDispatcher from "../event/EventDispatcher";
export default class Texture extends EventDispatcher {
    image: HTMLImageElement;
    width: number;
    height: number;
    protected _instanceType: string;
    constructor(src?: string);
    load(src: string): Promise<Texture>;
}
