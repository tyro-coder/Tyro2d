import HashObject from "../utils/HashObject";

export default class Event extends HashObject {
  destroy(): void {
    throw new Error("Method not implemented.");
  }

  public target: any

  protected _instanceType: string = 'Event'

  constructor() {
    super()
  }
}