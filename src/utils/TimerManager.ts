import Timer from "./Timer";

export default class TimerManager {
  /** 游戏主时针，同时也是管理场景，动画，缓动等效果时钟，通过控制本时针缩放，达到快进慢播效果 */
  static timer: Timer = new Timer()
  /** 系统时钟管理器，引擎内部使用*/
	static systemTimer: Timer = new Timer();
  /** 组件的update时钟管理器*/
	static updateTimer: Timer = new Timer();
}
