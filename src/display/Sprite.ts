import Texture from "../media/Texture"
import Node from "./Node"

export default class Sprite extends Node {
  public texture: Texture

  protected _instanceType: string = 'Sprite'

}
