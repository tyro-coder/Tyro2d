import { ENGINE_OBJECT_TYPE } from '../common/constants';

/**
 * 基础对象，用来标记类名及其唯一实例id
 */
export default abstract class HashObject {
  /** 对象实例的唯一id */
  protected _instanceId: number = 0;
  /** 对象实例的类型 */
  protected _instanceType: string = ENGINE_OBJECT_TYPE.HashObject;
  protected static _object_id = 0;

  constructor() {
    this._instanceId = HashObject._object_id++;
  }

  /**
   * 获取本对象的实例id
   */
  public get instanceId(): number {
    return this._instanceId;
  }

  /**
   * 获取本对象的实例类型
   */
  public get instanceType(): string {
    return this._instanceType;
  }

  abstract destroy(): void;
}
