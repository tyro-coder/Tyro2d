import Stage from '../display/Stage';
import HashObject from '../utils/HashObject';
import Node from '../display/Node';
import { ENGINE_OBJECT_TYPE, RENDER_TYPE } from '../common/constants';

/**
 * 渲染器
 */
export default abstract class Renderer extends HashObject {
  /** 画布对象 */
  canvas: HTMLCanvasElement;
  /** 舞台对象 */
  stage: Stage;
  /** 图像混合模式 */
  blendMode: GlobalCompositeOperation = 'source-over';
  /** 渲染类型 */
  renderType: RENDER_TYPE;
  /** 渲染上下文 */
  context: CanvasRenderingContext2D | WebGLRenderingContext | WebGL2RenderingContext;

  protected _instanceType: string = ENGINE_OBJECT_TYPE.Renderer;

  /**
   * 开始绘制
   * @param target 渲染节点
   * @returns 是否绘制成功
   */
  abstract startDraw(target: Node): boolean;

  /**
   * 绘制方法
   * @param target 渲染节点
   */
  abstract draw(target: Node): void;

  /**
   * 结束绘制
   * @param target 渲染节点
   */
  abstract endDraw(target: Node): void;

  /**
   * 画布矩阵变换方法
   * @param target 渲染节点
   */
  abstract transform(target: Node): void;

  /**
   * 调整画布大雄
   * @param width 画布宽
   * @param height 画布高
   */
  abstract resize(width: number, height: number): void;

  /**
   * 清空画布内矩形区域
   * @param x 起点x位置
   * @param y 起点y位置
   * @param width 范围宽
   * @param height 范围高
   */
  abstract clear(x: number, y: number, width: number, height: number): void;

  destroy(): void {}
}
