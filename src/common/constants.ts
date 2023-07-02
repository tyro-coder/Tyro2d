/**
 * 可视区域结构
 */
export interface IViewPort {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * 引擎内部类枚举类型
 */
export enum ENGINE_OBJECT_TYPE {
  /** 引擎基础类 */
  HashObject = 'tyro2d_object',
  /** 引擎渲染类 */
  Renderer = 'tyro2d_renderer',

  /** 引擎基础渲染节点类 */
  Node = 'tyro2d_node',
  /** 引擎舞台节点类 */
  Stage = 'tyro2d_stage',
  /** 引擎场景节点类 */
  Scene = 'tyro2d_scene',
  /** 引擎精灵图节点类 */
  Sprite = 'tyro2d_sprite',
  /** 引擎精灵图帧动画类 */
  SpriteFrame = 'tyro2d_sprite_frame',
  /** 引擎文本渲染节点类 */
  Text = 'tyro2d_text',
  /** 引擎位图文本渲染节点类 */
  BitmapText = 'tyro2d_bitmap_text',

  /** 引擎事件类 */
  Event = 'tyro2d_event',
  /** 引擎事件触发器类 */
  EventDispatcher = 'tyro2d_event_dispatcher',

  /** 引擎坐标类 */
  Point = 'tyro2d_point',
  /** 引擎多边形绘制类 */
  Polygon = 'tyro2d_polygon',
  /** 引擎矩阵类 */
  Matrix2d = 'tyro2d_matrix',
  /** 引擎向量类 */
  Vector2d = 'tyro2d_vector',
  /** 引擎图集资源类 */
  Texture = 'tyro2d_texture',
  /** 引擎节点包围盒类 */
  Bounds = 'tyro2d_bounds',
  /** 引擎缓动类 */
  Tween = 'tyro2d_tween',
}

/**
 * 引擎内部渲染方式
 */
export enum RENDER_TYPE {
  /** HTML5 Canvas */
  CANVAS,
  /** HTML5 WebGL */
  WEBGL,
}
