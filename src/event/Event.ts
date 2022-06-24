import HashObject from "../utils/HashObject";

export default class Event extends HashObject {
  public target: any

  protected _instanceType: string = 'Event'

  constructor() {
    super()
  }

  destory(): void {
    
  }
}