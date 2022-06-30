import * as math from './math/MathTool'
import Vector2d from './math/Vector2d'

import Event from './event/Event'
import EventDispatcher from './event/EventDispatcher'

/** Display */
import Container from './display/Container'
import Stage from './display/Stage'
import Sprite from './display/Sprite'

import Ticker from './utils/Ticker'

export default class Tyro2d {
  static math = math
  static Vector2d = Vector2d
  static Event = Event
  static Stage = Stage
  static Sprite = Sprite
  static Container = Container
  
  static eventBus: EventDispatcher = new EventDispatcher() 
  static ticker: Ticker = null
  static stage: Stage = null

  static start(stage: Stage, fps: number) {
    Tyro2d.stage = stage

    Tyro2d.ticker = new Ticker(fps)
    Tyro2d.ticker.addTick(stage)
  }

  static pause() {
    Tyro2d.ticker.pause()
  }

  static resume() {
    Tyro2d.ticker.resume()
  }

  static stop() {
    Tyro2d.ticker.stop()
  }

  static destroy() {
    Tyro2d.stage.destroy()
    Tyro2d.eventBus.destroy()
    Tyro2d.ticker.stop()
    Tyro2d.ticker.clear()

    Tyro2d.stage = null
    Tyro2d.ticker = null
  }
}
