/**
 * 基础对象，用来标记类名及其唯一实例id
 */
export default abstract class HashObject {
    protected _instanceId: number;
    protected _instanceType: string;
    protected static _object_id: number;
    constructor();
    /**
     * 获取本对象的实例id
     */
    get instanceId(): number;
    /**
     * 获取本对象的实例类型
     */
    get instanceType(): string;
    abstract destroy(): void;
}
