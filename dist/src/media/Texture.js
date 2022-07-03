import EventDispatcher from "../event/EventDispatcher";
export default class Texture extends EventDispatcher {
    constructor(src) {
        super();
        this.width = 0;
        this.height = 0;
        this._instanceType = 'Texture';
        if (src) {
            this.load(src);
        }
    }
    load(src) {
        return new Promise((resolve) => {
            const img = this.image = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                img.onload = null;
                this.width = img.width;
                this.height = img.height;
                resolve(this);
            };
            img.src = src;
        });
    }
}
