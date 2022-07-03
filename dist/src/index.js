import * as math from './math/MathTool';
import Vector2d from './math/Vector2d';
import Event from './event/Event';
import EventDispatcher from './event/EventDispatcher';
/** Display */
import Container from './display/Container';
import Stage from './display/Stage';
import Sprite from './display/Sprite';
import Ticker from './utils/Ticker';
export default class Tyro2d {
    static start(stage, fps) {
        Tyro2d.stage = stage;
        Tyro2d.ticker = new Ticker(fps);
        Tyro2d.ticker.addTick(stage);
    }
    static pause() {
        Tyro2d.ticker.pause();
    }
    static resume() {
        Tyro2d.ticker.resume();
    }
    static stop() {
        Tyro2d.ticker.stop();
    }
    static destroy() {
        Tyro2d.stage.destroy();
        Tyro2d.eventBus.destroy();
        Tyro2d.ticker.stop();
        Tyro2d.ticker.clear();
        Tyro2d.stage = null;
        Tyro2d.ticker = null;
    }
}
Tyro2d.math = math;
Tyro2d.Vector2d = Vector2d;
Tyro2d.Event = Event;
Tyro2d.Stage = Stage;
Tyro2d.Sprite = Sprite;
Tyro2d.Container = Container;
Tyro2d.eventBus = new EventDispatcher();
Tyro2d.ticker = null;
Tyro2d.stage = null;
