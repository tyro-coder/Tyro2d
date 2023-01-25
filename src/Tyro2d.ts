import EventDispatcher from './event/EventDispatcher'
import Stage from './display/Stage'
import Ticker from './utils/Ticker'
import Tween from './tween/Tween'

export default class Tyro2d {
  static Event = Event
  static stage: Stage
  static ticker: Ticker
  static eventBus: EventDispatcher
  static Tween = Tween

  /**
   * 开始游戏
   * @param stage 舞台对象
   * @param fps 帧率
   * @returns 
   */
  static start(stage: Stage, fps: number) {
    if (Tyro2d.stage) return

    Tyro2d.stage = stage
    Tyro2d.ticker = new Ticker(fps)
    Tyro2d.ticker.addTick(stage)
    Tyro2d.ticker.addTick(Tween)

    Tyro2d.ticker.start()
  }

  /**
   * 暂停游戏
   */
  static pause() {
    Tyro2d.ticker.pause()
  }

  /**
   * 继续游戏
   */
  static resume() {
    Tyro2d.ticker.resume()
  }

  /**
   * 终止游戏
   */
  static stop() {
    Tyro2d.ticker.stop()
  }

  /**
   * 销毁游戏实例
   */
  static destroy() {
    Tyro2d.stage.destroy()
    Tyro2d.Tween.removeAll()
    Tyro2d.eventBus.destroy()
    Tyro2d.ticker.stop()
    Tyro2d.ticker.clear()

    Tyro2d.stage = null
    Tyro2d.ticker = null
  }
}
