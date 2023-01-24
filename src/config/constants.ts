function addPrefix(s: string) {
  return `tyro2d_${s}`;
}

export const HASH_OBJECT_TYPE = {
  // 渲染器
  Renderer: addPrefix('Renderer'),
  CanvasRenderer: addPrefix('CanvasRenderer'),
  // 节点
  Node: addPrefix('Node'),
  Stage: addPrefix('Stage'),
  Scene: addPrefix('Scene'),
  Sprite: addPrefix('Sprite'),
  Text: addPrefix('Text'),
  BitmapText: addPrefix('BitmapText'),
  // 事件类
  Event: addPrefix('Event'),
  EventDispatcher: addPrefix('EventDispatcher'),
  // 几何绘图类
  Point: addPrefix('Point'),
  Polygon: addPrefix('Polygon'),
  // 数学工具类
  Matrix2d: addPrefix('Matrix2d'),
  Vector2d: addPrefix('Vector2d'),
  // 媒体资源类
  Texture: addPrefix('Texture'),
  // 物理类
  Bounds: addPrefix('Bounds'),
  // 缓动
}

export enum RENDER_TYPE {
  CANVAS,
  WEBGL,
}
