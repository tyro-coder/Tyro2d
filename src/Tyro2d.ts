import EventDispatcher from './event/EventDispatcher'
import Stage from './display/Stage'
import Ticker from './utils/Ticker'

export default class Tyro2d {
  static Event = Event
  static stage: Stage
  static ticker: Ticker
  static eventBus: EventDispatcher

  static start(stage: Stage, fps: number) {
    if (Tyro2d.stage) return

    Tyro2d.stage = stage
    Tyro2d.ticker = new Ticker(fps)
    Tyro2d.ticker.addTick(stage)

    Tyro2d.ticker.start()
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
