export default class Pool {
    private static POOLSIGN;
    private static _poolDic;
    /**
     * 通过标识获取该类的对象池
     * @param sign 标识
     * @returns
     */
    static getPoolBySign(sign: string): any[];
    /**
     * 通过标识清空某类下的对象池
     * @param sign 标识
     */
    static clearBySign(sign: string): void;
    /**
     * 回收某个类标识的实例
     * @param sign 类标识
     * @param ins 类实例
     * @returns
     */
    static recover(sign: string, ins: any): void;
    /**
     * 通过类标识和类，根据对象池获取某个类实例
     * @param sign 类标识
     * @param cls 类
     * @returns
     */
    static getInstanceByClass<T>(sign: string, cls: new () => T): T;
}
