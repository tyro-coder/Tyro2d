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
    static math: typeof math;
    static Vector2d: typeof Vector2d;
    static Event: typeof Event;
    static Stage: typeof Stage;
    static Sprite: typeof Sprite;
    static Container: typeof Container;
    static eventBus: EventDispatcher;
    static ticker: Ticker;
    static stage: Stage;
    static start(stage: Stage, fps: number): void;
    static pause(): void;
    static resume(): void;
    static stop(): void;
    static destroy(): void;
}
