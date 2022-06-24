import * as math from './math/math'
import Vector2d from './math/Vector2d'

import Event from './event/Event'
import EventDispatcher from './event/EventDispatcher'

/** Display */
import Node from './display/Node'
import Stage from './display/Stage'
import Sprite from './display/Sprite'


const tyro2d = {
  // math
  math,
  Vector2d,

  // 事件
  Event,
  EventDispatcher,

  // display 节点
  Node,
  Stage,
  Sprite,

  // utils
}

export default tyro2d
