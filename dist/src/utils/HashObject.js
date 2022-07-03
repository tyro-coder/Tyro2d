/**
 * 基础对象，用来标记类名及其唯一实例id
 */
export default class HashObject {
    constructor() {
        this._instanceId = 0;
        this._instanceType = 'HashObject';
        this._instanceId = HashObject._object_id++;
    }
    /**
     * 获取本对象的实例id
     */
    get instanceId() {
        return this._instanceId;
    }
    /**
     * 获取本对象的实例类型
     */
    get instanceType() {
        return this._instanceType;
    }
}
HashObject._object_id = 0;
