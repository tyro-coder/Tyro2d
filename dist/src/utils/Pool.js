export default class Pool {
    /**
     * 通过标识获取该类的对象池
     * @param sign 标识
     * @returns
     */
    static getPoolBySign(sign) {
        return Pool._poolDic[sign] || (Pool._poolDic[sign] = []);
    }
    /**
     * 通过标识清空某类下的对象池
     * @param sign 标识
     */
    static clearBySign(sign) {
        if (Pool._poolDic[sign])
            Pool._poolDic[sign].length = 0;
    }
    /**
     * 回收某个类标识的实例
     * @param sign 类标识
     * @param ins 类实例
     * @returns
     */
    static recover(sign, ins) {
        if (ins[Pool.POOLSIGN])
            return;
        ins[Pool.POOLSIGN] = true;
        Pool.getPoolBySign(sign).push(ins);
    }
    /**
     * 通过类标识和类，根据对象池获取某个类实例
     * @param sign 类标识
     * @param cls 类
     * @returns
     */
    static getInstanceByClass(sign, cls) {
        if (!Pool._poolDic[sign])
            return new cls();
        const pool = Pool._poolDic[sign];
        let rst;
        if (pool.length) {
            rst = pool.pop();
            rst[Pool.POOLSIGN];
            false;
        }
        else {
            rst = new cls();
        }
        return rst;
    }
}
Pool.POOLSIGN = "__isInPool";
Pool._poolDic = {};
