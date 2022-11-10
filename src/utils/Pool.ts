interface IPoolDic {
  [key: string]: any[]
}

export enum POOL_SIGN {
  Point = 'Point',
  Bounds = 'Bounds',
  Polygon = 'Polygon',
  Vector2d = 'Vector2d',
}


/**
 * 对象池，引擎内部使用，不建议在游戏业务里面使用
 * 游戏业务逻辑需要使用对象池的话，请自行处理
 */
export default class Pool {
  private static POOLSIGN: string = "__isInPool";
  private static _poolDic: IPoolDic = {};

  /**
   * 通过标识获取该类的对象池
   * @param sign 标识
   * @returns 
   */
  static getPoolBySign(sign: POOL_SIGN): any[] {
    return Pool._poolDic[sign] || (Pool._poolDic[sign] = []);
  }

  /**
   * 通过标识清空某类下的对象池
   * @param sign 标识
   */
  static clearBySign(sign: POOL_SIGN): void {
    if (Pool._poolDic[sign]) Pool._poolDic[sign].length = 0;
  }

  /**
   * 回收某个类标识的实例
   * @param sign 类标识
   * @param ins 类实例
   * @returns 
   */
  static recover(sign: POOL_SIGN, ins: any) {
    if (ins[Pool.POOLSIGN]) return;
    ins[Pool.POOLSIGN] = true;
    Pool.getPoolBySign(sign).push(ins);
  }

  /**
   * 通过类标识和类，根据对象池获取某个类实例
   * @param sign 类标识
   * @param cls 类
   * @returns 
   */
  static getInstanceByClass<T>(sign: POOL_SIGN, cls: new (...p: any[]) => T): T {
    if (!Pool._poolDic[sign]) return new cls();

    const pool = Pool._poolDic[sign];
    let rst: T
    if (pool.length) {
      rst = pool.shift();
      (rst as any)[Pool.POOLSIGN] = false;
    } else {
      rst = new cls()
    }
    return rst;
  }
}
