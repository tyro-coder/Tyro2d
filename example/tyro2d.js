class MathTool {
    /**
     * 将一个角度转换为弧度
     * @param angle 角度
     * @returns
     */
    static degToRed(angle) {
        return angle * MathTool.DEG_TO_RAD;
    }
    /**
     * 将一个弧度转换为角度
     * @param radians 弧度
     * @returns
     */
    static radToDeg(radians) {
        return radians * MathTool.RAD_TO_DEG;
    }
    /**
     * 将一个值限死在某个范围内，前后闭合
     * @param val 值
     * @param low 最低值
     * @param high 最高值
     * @returns
     */
    static clamp(val, low, high) {
        return val < low ? low : val > high ? high : val;
    }
    /**
     * 返回最小值（包括）与最大值（不包括）之间的整数
     * @param min 最小值
     * @param max 最大值
     * @returns 随机值
     */
    static randomNum(min, max) {
        return (~~(Math.random() * (max - min)) + min);
    }
}
MathTool.DEG_TO_RAD = Math.PI / 180.0;
MathTool.RAD_TO_DEG = 180.0 / Math.PI;
MathTool.TAU = Math.PI * 2;

/**
 * 基础对象，用来标记类名及其唯一实例id
 */
class HashObject {
    constructor() {
        this._instanceId = 0;
        this._instanceType = 'HashObject';
        this._instanceId = HashObject._object_id++;
    }
    /**
     * 获取本对象的实例id
     */
    get instanceId() {
        return this._instanceId;
    }
    /**
     * 获取本对象的实例类型
     */
    get instanceType() {
        return this._instanceType;
    }
}
HashObject._object_id = 0;

class Pool {
    /**
     * 通过标识获取该类的对象池
     * @param sign 标识
     * @returns
     */
    static getPoolBySign(sign) {
        return Pool._poolDic[sign] || (Pool._poolDic[sign] = []);
    }
    /**
     * 通过标识清空某类下的对象池
     * @param sign 标识
     */
    static clearBySign(sign) {
        if (Pool._poolDic[sign])
            Pool._poolDic[sign].length = 0;
    }
    /**
     * 回收某个类标识的实例
     * @param sign 类标识
     * @param ins 类实例
     * @returns
     */
    static recover(sign, ins) {
        if (ins[Pool.POOLSIGN])
            return;
        ins[Pool.POOLSIGN] = true;
        Pool.getPoolBySign(sign).push(ins);
    }
    /**
     * 通过类标识和类，根据对象池获取某个类实例
     * @param sign 类标识
     * @param cls 类
     * @returns
     */
    static getInstanceByClass(sign, cls) {
        if (!Pool._poolDic[sign])
            return new cls();
        const pool = Pool._poolDic[sign];
        let rst;
        if (pool.length) {
            rst = pool.pop();
            rst[Pool.POOLSIGN] = false;
        }
        else {
            rst = new cls();
        }
        return rst;
    }
}
Pool.POOLSIGN = "__isInPool";
Pool._poolDic = {};

class Vector2d extends HashObject {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this._instanceType = 'Vector2d';
        this.reset();
    }
    destroy() {
    }
    /**
     * 从对象池里面构造一个Vector2d对象
     * @returns Vector2d对象
     */
    static create() {
        return Pool.getInstanceByClass('Vector2d', Vector2d);
    }
    /**
     * 回收该对象
     * @returns
     */
    recover() {
        if (this === Vector2d.EMPTY)
            return;
        Pool.recover('Vector2d', this.reset());
    }
    reset() {
        this.x = 0;
        this.y = 0;
        return this;
    }
    set(x, y) {
        return this._set(x, y);
    }
    setZero() {
        return this.set(0, 0);
    }
    setV(v) {
        return this._set(v.x, v.y);
    }
    add(v) {
        return this._set(this.x + v.x, this.y + v.y);
    }
    sub(v) {
        return this._set(this.x - v.x, this.y - v.y);
    }
    scale(x, y) {
        return this._set(this.x * x, this.y * (typeof y !== 'undefined' ? y : x));
    }
    toIso() {
    }
    /**
     * 将向量转为2d坐标
     * @returns
     */
    to2d() {
        return this._set(this.y + this.x / 2, this.y - this.x / 2);
    }
    scaleV(v) {
        return this._set(this.x * v.x, this.y * v.y);
    }
    /**
     * 向量除以某个值
     * @param n 值
     * @returns
     */
    div(n) {
        return this._set(this.x / n, this.y / n);
    }
    /**
     * 绝对值化向量
     * @returns
     */
    abs() {
        return this._set((this.x < 0) ? -this.x : this.x, (this.y < 0) ? -this.y : this.y);
    }
    /**
     * 获取一个新的锁定在范围内的向量
     * @param low 最小值
     * @param high 最大值
     * @returns
     */
    clamp(low, high) {
        return Vector2d.create().set(MathTool.clamp(this.x, low, high), MathTool.clamp(this.y, low, high));
    }
    /**
     * 将本向量锁定在范围内
     * @param low 最小值
     * @param high 最大值
     * @returns
     */
    clampSelf(low, high) {
        return this._set(MathTool.clamp(this.x, low, high), MathTool.clamp(this.y, low, high));
    }
    /**
     * 比较向量，并将本向量更新为最小的那个
     * @param v 比较的向量
     * @returns
     */
    minV(v) {
        return this._set((this.x < v.x) ? this.x : v.x, (this.y < v.y) ? this.y : v.y);
    }
    /**
     * 比较向量，并将本向量更新为最大的那个
     * @param v 比较的向量
     * @returns
     */
    maxV(v) {
        return this._set((this.x > v.x) ? this.x : v.x, (this.y > v.y) ? this.y : v.y);
    }
    /**
     * 获得一个新的向下取整的向量
     * @returns
     */
    floor() {
        return Vector2d.create().set(Math.floor(this.x), Math.floor(this.y));
    }
    /**
     * 向下取整本向量
     * @returns
     */
    floorSelf() {
        return this._set(Math.floor(this.x), Math.floor(this.y));
    }
    /**
     * 获得一个新的向上取整向量
     * @returns
     */
    ceil() {
        return Vector2d.create().set(Math.ceil(this.x), Math.ceil(this.y));
    }
    /**
     * 向上取整本向量
     * @returns
     */
    ceilSelf() {
        return this._set(Math.ceil(this.x), Math.ceil(this.y));
    }
    /**
     * 获得一个新的取负向量
     */
    negate() {
        return Vector2d.create().set(-this.x, -this.y);
    }
    /**
     * 取负值本向量
     * @returns
     */
    negateSelf() {
        return this._set(-this.x, -this.y);
    }
    copy(v) {
        return this._set(v.x, v.y);
    }
    equal(x, y) {
        let _x, _y;
        if (typeof x === 'number' && typeof y === 'number') {
            _x = x;
            _y = y;
        }
        else {
            _x = x.x;
            _y = x.y;
        }
        return ((this.x === _x) && (this.y === _y));
    }
    /**
     * 将向量单位化
     * @returns
     */
    normalize() {
        return this.div(this.length() || 1);
    }
    /**
     * 改变这个向量，使其垂直于之前的向量
     */
    perp() {
        return this._set(this.y, -this.x);
    }
    /**
     * 旋转本向量
     * @param angle 旋转角度
     * @param v 可选的旋转参考向量
     * @returns
     */
    rotate(angle, v) {
        let cx = 0, cy = 0;
        if (v && typeof v === 'object') {
            cx = v.x;
            cy = v.y;
        }
        const x = this.x - cx;
        const y = this.y - cy;
        const c = Math.cos(angle);
        const s = Math.sin(angle);
        return this._set(x * c - y * s + cx, x * s + y * c + cy);
    }
    /**
     * 获取这个向量和目标向量的点积
     * @param v 目标向量
     * @returns
     */
    dotProduct(v) {
        return this.x * v.x + this.y * v.y;
    }
    /**
     * 获取本向量的平方长度
     * @returns
     */
    length2() {
        return this.dotProduct(this);
    }
    /**
     * 获取向量的长度
     * @returns
     */
    length() {
        return Math.sqrt(this.length2());
    }
    /**
     * 获取与目标向量的距离
     * @param v 目标向量
     * @returns
     */
    distance(v) {
        const dx = this.x - v.x, dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    /**
     * 获取与目标向量之间的夹角
     * @param v 目标向量
     * @returns
     */
    angle(v) {
        return Math.acos(MathTool.clamp(this.dotProduct(v) / (this.length() * v.length()), -1, 1));
    }
    /**
     * 将本向量投射到目标向量上
     * @param v 目标向量
     * @returns
     */
    project(v) {
        return this.scale(this.dotProduct(v) / v.length2());
    }
    /**
     * 获得一个此向量的克隆副本
     * @returns
     */
    clone() {
        return Vector2d.create().set(this.x, this.y);
    }
    toString() {
        return `(x: ${this.x}, y: ${this.y})`;
    }
    _set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
}
Vector2d.EMPTY = new Vector2d();

class Event$1 extends HashObject {
    constructor() {
        super();
        this._instanceType = 'Event';
    }
    destroy() {
        throw new Error("Method not implemented.");
    }
}

/**
 * Handler: 事件处理器类
 * 建议使用 Handler.create() 方法从对象池创建，减少对象创建消耗；
 * 创建的 Handler 对象不再使用后，可以使用 Handler.recover() 方法将其回收到对象池，回收后不要再使用此对象，否则会出现不可预料的错误；
 */
class Handler {
    /**
     * 创建一个 Handler 类实例
     * @param caller 执行域
     * @param callback 回调函数
     * @param args 函数参数
     * @param once 是否只执行一次
     */
    constructor(caller = null, callback = null, args = null, once = false) {
        /** 执行域(this) */
        this.caller = null;
        /** 回调方法 */
        this.callback = null;
        /** 参数 */
        this.args = null;
        /** 是否只执行一次，若为true，回调后自动执行 recover() 进行回收，回收后会被再利用，默认为 false */
        this.once = false;
        /**@private */
        this._id = 0;
        this.setTo(caller, callback, args, once);
    }
    /**
     * 设置此对象的属性值
     * @param caller 执行域
     * @param callback 回调函数
     * @param args 函数参数
     * @param once 是否只执行一次
     * @returns 返回 handler 本身
     */
    setTo(caller = null, callback = null, args = null, once = false) {
        this._id = Handler._gid++;
        this.caller = caller;
        this.callback = callback;
        this.args = args;
        this.once = once;
        return this;
    }
    /**
     * 执行处理器
     * @returns 执行结果
     */
    run() {
        if (this.callback == null)
            return null;
        const id = this._id;
        const result = this.callback.apply(this.caller, this.args);
        // 如果 once 为 true 的话，执行完之后就清理当前 handler 实例
        this._id === id && this.once && this.recover();
        return result;
    }
    /**
     * 执行处理器，并携带额外数据
     * @param data 附加的回调数据，可以是多参，单数据或数组
     * @returns 执行结果
     */
    runWith(data) {
        if (this.callback == null)
            return null;
        const id = this._id;
        let result;
        if (data == null) {
            result = this.callback.apply(this.caller, this.args);
        }
        else if (!this.args && !Array.isArray(data)) {
            result = this.callback.call(this.caller, data);
        }
        else if (this.args) {
            result = this.callback.apply(this.caller, this.args.concat(data));
        }
        else {
            result = this.callback.apply(this.caller, data);
        }
        this._id === id && this.once && this.recover();
        return result;
    }
    /**
     * 清理对象引用
     * @returns 清理后的对象
     */
    clear() {
        this.caller = null;
        this.callback = null;
        this.args = null;
        return this;
    }
    /**
     * 清理当前handler实例，并回收到 Handler 对象池内
     */
    recover() {
        if (this._id > 0) {
            this._id = 0;
            Handler._pool.push(this.clear());
        }
    }
    /**
     * 从对象池内创建一个Handler，默认会执行一次并立即回收，如果不需要自动回收，设置 once 参数为 false
     * @param caller 执行域(this)
     * @param callback 回调方法
     * @param args 携带的参数
     * @param once 是否只执行一次，如果为true，回调后会直接回收，默认为true
     * @returns 返回创建的handler实例
     */
    static create(caller = null, callback = null, args = null, once = true) {
        if (Handler._pool.length) {
            return Handler._pool.pop().setTo(caller, callback, args, once);
        }
        return new Handler(caller, callback, args, once);
    }
}
/**@private Handler 对象池 */
Handler._pool = [];
/**@private */
Handler._gid = 1;

/**
 * EventDispatcher 类是可调度事件的所有类的基类
 */
class EventDispatcher extends HashObject {
    constructor() {
        super();
        this._instanceType = 'EventDispatcher';
    }
    hasListener(type) {
        const listener = this._events && this._events[type];
        return !!listener;
    }
    emit(type, data = null) {
        if (!this._events || !this._events[type])
            return false;
        const listeners = this._events[type];
        if (listeners.run) {
            if (listeners.once)
                delete this._events[type];
            data != null ? listeners.runWith(data) : listeners.run();
        }
        else {
            for (let i = 0, n = listeners.length; i < n; i++) {
                const listener = listeners[i];
                if (listener) {
                    data != null ? listener.runWith(data) : listener.run();
                }
                if (!listener || listener.once) {
                    listeners.splice(i, 1);
                    i--;
                    n--;
                }
            }
            if (listeners.length === 0 && this._events && !this._events[type].run) {
                delete this._events[type];
            }
        }
        return true;
    }
    on(type, listener, caller, args = null) {
        return this._createListener(type, listener, caller, args, false);
    }
    once(type, listener, caller, args = null) {
        return this._createListener(type, listener, caller, args, true);
    }
    off(type, listener, caller, onceOnly = false) {
        if (!this._events || !this._events[type])
            return this;
        const listeners = this._events[type];
        if (listeners != null) {
            if (listeners.run) {
                if ((!caller || listeners.caller === caller)
                    && (listener == null || listeners.callback === listener)
                    && (!onceOnly || listeners.once)) {
                    delete this._events[type];
                    listeners.recover();
                }
            }
            else {
                let count = 0;
                const n = listeners.length;
                for (let i = 0; i < n; i++) {
                    const item = listeners[i];
                    if (!item) {
                        count++;
                        continue;
                    }
                    if (item
                        && (!caller || listeners.caller === caller)
                        && (listener == null || listeners.callback === listener)
                        && (!onceOnly || listeners.once)) {
                        count++;
                        listeners[i] = null;
                        item.recover();
                    }
                }
                // 如果全部移除
                if (count === n)
                    delete this._events[type];
            }
        }
        return this;
    }
    offAll(type) {
        const events = this._events;
        if (!events)
            return this;
        if (type) {
            this._recoverHandlers(events[type]);
            delete events[type];
        }
        else {
            for (const name in events) {
                this._recoverHandlers(events[name]);
            }
            this._events = null;
        }
        return this;
    }
    offAllCaller(caller) {
        if (caller && this._events) {
            for (const type in this._events) {
                this.off(type, null, caller);
            }
        }
        return this;
    }
    _createListener(type, listener, caller, args, once, offBefore = true) {
        // 移除之前相同的监听
        offBefore && this.off(type, listener, caller, once);
        const handler = EventHandler.create(caller || this, listener, args, once);
        this._events || (this._events = {});
        const events = this._events;
        if (!events[type])
            events[type] = handler;
        else {
            if (Array.isArray(events[type]))
                events[type].push(handler);
            else
                events[type] = [events[type], handler];
        }
        return this;
    }
    _recoverHandlers(arr) {
        if (!arr)
            return;
        if (arr.run) {
            arr.recover();
        }
        else {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i]) {
                    arr[i].recover();
                    arr[i] = null;
                }
            }
        }
    }
    destroy() {
    }
}
/**@private */
class EventHandler extends Handler {
    constructor(caller, callback, args, once) {
        super(caller, callback, args, once);
    }
    /**
     * @override
     */
    recover() {
        if (this._id > 0) {
            this._id = 0;
            EventHandler._pool.push(this.clear());
        }
    }
    /**
       * 从对象池内创建一个 EventHandler，默认会执行一次回收，如果不需要自动回收，设置once参数为false。
       * @param caller	执行域(this)。
       * @param callback	回调方法。
       * @param args		（可选）携带的参数。
       * @param once		（可选）是否只执行一次，如果为true，回调后执行recover()进行回收，默认为true。
       * @return 返回创建的 EventHandler 实例。
       */
    static create(caller, callback, args = null, once = true) {
        if (EventHandler._pool.length)
            return EventHandler._pool.pop().setTo(caller, callback, args, once);
        return new EventHandler(caller, callback, args, once);
    }
}
/**@private EventHandler 对象池 */
EventHandler._pool = [];

/**
 * 2d矩阵类
 *  a c dx
 * [b d dy]
 *  0 0 1
 */
class Matrix2d extends HashObject {
    constructor(a = 1, b = 0, c = 0, d = 1, dx = 0, dy = 0) {
        super();
        this._instanceType = 'Matrix2d';
        this.set(a, b, c, d, dx, dy);
    }
    /**
     * 设置当前矩阵的值
     * @param a
     * @param b
     * @param c
     * @param d
     * @param dx
     * @param dy
     * @returns
     */
    set(a = 1, b = 0, c = 0, d = 1, dx = 0, dy = 0) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.dx = dx;
        this.dy = dy;
        return this;
    }
    /**
     * 复制目标矩阵的值
     * @param m 模板矩阵
     * @returns 当前矩阵
     */
    copy(m) {
        this.a = m.a;
        this.b = m.b;
        this.c = m.c;
        this.d = m.d;
        this.dx = m.dx;
        this.dy = m.dy;
        return this;
    }
    /**
     * 复制当前矩阵并返回一个新的矩阵对象
     * @returns 新的矩阵
     */
    clone() {
        return new Matrix2d().copy(this);
    }
    /**
     * 将某个矩阵与当前矩阵连接
     * @param mtx 目标矩阵
     * @returns 当前矩阵新的值
     */
    concat(mtx) {
        const a = this.a, b = this.b, c = this.c, d = this.d, dx = this.dx, dy = this.dy;
        const ma = mtx.a, mb = mtx.b, mc = mtx.c, md = mtx.d, mx = mtx.dx, my = mtx.dy;
        this.a = a * ma + b * mc;
        this.b = a * mb + b * md;
        this.c = c * ma + d * mc;
        this.d = c * mb + d * md;
        this.dx = dx * ma + dy * mc + mx;
        this.dy = dx * mb + dy * md + my;
        return this;
    }
    /**
     * 将当前矩阵进行旋转
     * @param angle 旋转的角度
     * @returns 当前矩阵
     */
    rotate(angle) {
        const red = MathTool.degToRed(angle);
        const sin = Math.sin(red), cos = Math.cos(red);
        const a = this.a, b = this.b, c = this.c, d = this.d, dx = this.dx, dy = this.dy;
        this.a = a * cos + c * sin;
        this.b = b * cos + d * sin;
        this.c = c * cos - a * sin;
        this.d = d * cos - b * sin;
        this.dx = dx * cos - dy * sin;
        this.dy = dx * sin + dy * cos;
        return this;
    }
    /**
     * 将当前矩阵进行缩放
     * @param sx x 轴缩放系数，偏移系数
     * @param sy y 轴缩放系数，偏移系数
     * @returns 当前矩阵
     */
    scale(sx, sy) {
        this.a *= sx;
        this.d *= sy;
        this.c *= sx;
        this.b *= sy;
        return this;
    }
    /**
     * 将当前矩阵进行平移
     * @param x x 轴平移距离
     * @param y y 轴平移距离
     * @returns 当前矩阵
     */
    translate(x, y) {
        this.dx += x;
        this.dy += y;
        return this;
    }
    /**
     * 将当前矩阵单位化
     * @returns 当前矩阵
     */
    identity() {
        this.a = this.d = 1;
        this.b = this.c = this.dx = this.dy = 0;
        return this;
    }
    /**
     * 将当前矩阵逆转换
     * @returns 当前矩阵
     */
    invert() {
        const a = this.a, b = this.b, c = this.c, d = this.d, dx = this.dx;
        const i = a * d - b * c;
        this.a = d / i;
        this.b = -b / i;
        this.c = -c / i;
        this.d = a / i;
        this.dx = (c * this.dy - d * dx) / i;
        this.dy = -(a * this.dy - b * dx) / i;
        return this;
    }
    destroy() {
    }
}

class Transform2d extends HashObject {
    constructor() {
        super();
        /** 旋转角度 */
        this._rotation = 0;
        /** x轴放大倍数 */
        this._scaleX = 1;
        /** y轴放大倍数 */
        this._scaleY = 1;
        /** x轴位移 */
        this._x = 0;
        /** y轴位移 */
        this._y = 0;
        /** x轴倾斜角度 */
        this._skewX = 0;
        /** y轴倾斜角度 */
        this._skewY = 0;
        /** x轴锚点 */
        this._anchorX = 0;
        /** y轴锚点 */
        this._anchorY = 0;
        this._instanceType = 'Transform2d';
        this._mMatrix = new Matrix2d();
    }
    get matrix() {
        return this._mMatrix;
    }
    /** 旋转角度 */
    get rotation() {
        return this._rotation;
    }
    set rotation(val) {
        if (this._rotation !== val) {
            this._rotation = val;
            this._mMatrix.rotate(val);
        }
    }
    get scaleX() {
        return this._scaleX;
    }
    set scaleX(val) {
        if (this._scaleX !== val) {
            this._mMatrix.scale(val / this._scaleX, 1);
            this._scaleX = val;
        }
    }
    get scaleY() {
        return this._scaleY;
    }
    set scaleY(val) {
        if (this._scaleY !== val) {
            this._mMatrix.scale(1, val / this._scaleY);
            this._scaleY = val;
        }
    }
    get anchorX() {
        return this._anchorX;
    }
    set anchorX(val) {
        if (this._anchorX !== val) {
            this._mMatrix.translate((val - this._anchorX) * this.scaleX, 0);
            this._anchorX = val;
        }
    }
    get anchorY() {
        return this._anchorY;
    }
    set anchorY(val) {
        if (this._anchorY !== val) {
            this._mMatrix.translate(0, (val - this._anchorY) * this.scaleY);
            this._anchorY = val;
        }
    }
    get x() {
        return this._x;
    }
    set x(val) {
        if (this._x !== val) {
            this._mMatrix.translate(val - this._x, 0);
            this._x = val;
        }
    }
    get y() {
        return this._y;
    }
    set y(val) {
        if (this._y !== val) {
            this._mMatrix.translate(0, val - this._y);
            this._y = val;
        }
    }
    destroy() {
    }
}

var RENDER_TYPE;
(function (RENDER_TYPE) {
    RENDER_TYPE[RENDER_TYPE["CANVAS"] = 0] = "CANVAS";
    RENDER_TYPE[RENDER_TYPE["WEBGL"] = 1] = "WEBGL";
})(RENDER_TYPE || (RENDER_TYPE = {}));

/**
 * Node 节点，所有游戏内元素的基类
 */
class Node extends EventDispatcher {
    constructor() {
        super();
        /** 节点是否可见，默认为true */
        this.visible = true;
        /** 节点是否可接受交互事件 */
        this.mouseEnable = true;
        /** 是否裁剪超出容器范围的子元素，默认 false */
        this.clipChildren = false;
        /** 节点的渲染方式 */
        this.blendMode = 'source-over';
        this._instanceType = 'Node';
        this._width = 0;
        this._height = 0;
        this._anchorX = 0;
        this._anchorY = 0;
        this._opacity = 1;
        this._destroyed = false;
        this._parent = null;
        /**@internal 子对象集合 */
        this._children = Node.ARRAY_EMPTY;
        this._transform = new Transform2d();
    }
    /** 透明度 */
    get opacity() {
        return this._opacity;
    }
    set opacity(val) {
        if (this._opacity !== val) {
            this._opacity = val;
        }
    }
    /** 相对父容器的x轴偏移量 */
    get x() {
        return this._transform.x;
    }
    set x(val) {
        if (this.x !== val) {
            this._transform.x = val;
        }
    }
    /** 相对父容器的y轴偏移量 */
    get y() {
        return this._transform.y;
    }
    set y(val) {
        if (this.y !== val) {
            this._transform.y = val;
        }
    }
    /**
     * 设置位置
     * @param x x轴相对父容器偏移量
     * @param y y轴相对父容器偏移量
     * @returns 对象本身
     */
    setPos(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    /** 节点的宽 */
    get width() {
        return this._width;
    }
    set width(val) {
        if (this._width !== val) {
            this._width = val;
        }
    }
    /** 节点的高 */
    get height() {
        return this._height;
    }
    set height(val) {
        if (this._height !== val) {
            this._height = val;
        }
    }
    /** x轴缩放 */
    get scaleX() {
        return this._transform.scaleX;
    }
    set scaleX(val) {
        if (this.scaleX !== val) {
            this._transform.scaleX = val;
        }
    }
    /** y轴缩放值 */
    get scaleY() {
        return this._transform.scaleY;
    }
    set scaleY(val) {
        if (this.scaleY !== val) {
            this._transform.scaleY = val;
        }
    }
    /**
     * 设置缩放量
     * @param x x轴缩放倍数
     * @param y y轴缩放倍数
     * @returns 对象本身
     */
    setScale(x, y) {
        this.scaleX = x;
        this.scaleY = y;
        return this;
    }
    /** 旋转角度 */
    get rotation() {
        return this._transform.rotation;
    }
    set rotation(val) {
        if (this.rotation !== val) {
            this._transform.rotation = val;
        }
    }
    get transform() {
        return this._transform;
    }
    /** x轴锚点 */
    get anchorX() {
        return this._transform.anchorX;
    }
    set anchorX(val) {
        if (this.anchorX !== val) {
            this._transform.anchorX = val;
        }
    }
    /** y轴锚点 */
    get anchorY() {
        return this._transform.anchorY;
    }
    set anchorY(val) {
        if (this.anchorY !== val) {
            this._transform.anchorY = val;
        }
    }
    /**
     * 设置锚点
     * @param x x轴锚点位置
     * @param y y轴锚点位置
     * @returns 对象本身
     */
    setAnchor(x, y) {
        this.anchorX = x;
        this.anchorY = y;
        return this;
    }
    /** 是否销毁 */
    get destroyed() {
        return this._destroyed;
    }
    set destroyed(val) {
        if (this._destroyed !== val) {
            this._destroyed = val;
        }
    }
    /** 父节点 */
    get parent() {
        return this._parent;
    }
    set parent(p) {
        if (this._parent !== p) {
            this._parent = p;
        }
    }
    /** 子节点数组 */
    get children() {
        return this._children;
    }
    /** 字节点数目 */
    get childrenNum() {
        return this._children.length;
    }
    destroy() {
    }
    /**
     * 帧循环监听
     * @param delta 距离上一帧的时间
     * @returns {boolean} 返回false的话，不会对本对象进行渲染
     */
    onUpdate(delta) {
        return true;
    }
    /**
     * 添加子节点
     * @param child 可视对象
     * @returns 返回添加的节点
     */
    addChild(child) {
        if (!child || this.destroyed || child === this)
            return child;
        if (child.parent === this) {
            const index = this.getChildIndex(child);
            if (index !== this._children.length - 1) {
                this._children.splice(index, 1);
                this._children.push(child);
                this._childChanged();
            }
        }
        else {
            child.parent && child.parent.removeChild(child);
            this._children === Node.ARRAY_EMPTY && (this._children = []);
            this._children.push(child);
            child.parent = this;
            this._childChanged();
        }
        return child;
    }
    /**
     * 添加子节点到指定的索引位置
     * @param child 节点对象
     * @param index 索引位置
     * @returns 返回添加的节点
     */
    addChildAt(child, index) {
        if (!child || this.destroyed || child === this)
            return child;
        if (index >= 0 && index <= this._children.length) {
            if (child.parent === this) {
                const oldIndex = this.getChildIndex(child);
                this._children.splice(oldIndex, 1);
                this._children.splice(index, 0, child);
                this._childChanged();
            }
            else {
                child.parent && child.parent.removeChild(child);
                this._children === Node.ARRAY_EMPTY && (this._children = []);
                this._children.splice(index, 0, child);
                child.parent = this;
            }
            return child;
        }
        else {
            throw new Error('addChildAt: The index is out of bounds');
        }
    }
    /**
     * 批量增加子节点
     * @param ...args 无数子节点
     */
    addChildren(...args) {
        let i = 0;
        const n = args.length;
        while (i < n) {
            this.addChild(args[i++]);
        }
    }
    /**
     * 根据子节点对象，获取子节点的索引位置
     * @param child 子节点
     * @returns 子节点所在索引位置
     */
    getChildIndex(child) {
        return this._children.indexOf(child);
    }
    /**
     * 根据子节点的名字，获取子节点对象
     * @param name 子节点的名字
     * @returns 节点对象
     */
    getChildByName(name) {
        const children = this._children;
        if (children) {
            for (let i = 0, n = children.length; i < n; i++) {
                const child = children[i];
                if (!child)
                    continue;
                if (child.name === name)
                    return child;
            }
        }
        return null;
    }
    /**
     * 根据子节点的索引位置，获取子节点对象
     * @param index 索引位置
     * @returns 子节点
     */
    getChildAt(index) {
        return this._children[index] || null;
    }
    /**
     * 设置子节点的索引位置
     * @param child 子节点
     * @param index 新的索引
     * @returns 返回子节点本身
     */
    setChildIndex(child, index) {
        const childs = this._children;
        if (index < 0 || index >= childs.length) {
            throw new Error('setChildIndex: The index is out of bounds.');
        }
        const oldIndex = this.getChildIndex(child);
        if (oldIndex < 0)
            throw new Error('setChildIndex: node is must child of this object.');
        childs.splice(oldIndex, 1);
        childs.splice(index, 0, child);
        this._childChanged();
        return child;
    }
    /**
     * 删除子节点
     * @param child 子节点
     * @returns 被删除的节点
     */
    removeChild(child) {
        if (!this._children)
            return child;
        const index = this._children.indexOf(child);
        return this.removeChildAt(index);
    }
    /**
     * 根据子节点名字删除对应子节点，如果找不到的话返回null
     * @param name 节点对象名字
     * @returns 被删除的节点
     */
    removeChildByName(name) {
        const child = this.getChildByName(name);
        child && this.removeChild(child);
        return child;
    }
    /**
     * 根据子节点的索引位置，删除对应的子节点对象
     * @param index 节点索引位置
     * @return 被删除的节点
     */
    removeChildAt(index) {
        const child = this.getChildAt(index);
        if (child) {
            this._children.splice(index, 1);
            child.parent = null;
        }
        return child;
    }
    /**
     * 删除指定索引区间的所有子对象
     * @param beginIndex 开始索引
     * @param endIndex 索引
     * @returns 当前节点对象
     */
    removeChildren(beginIndex = 0, endIndex = 0x7fffffff) {
        if (this._children && this._children.length > 0) {
            let childs = this._children;
            if (beginIndex === 0 && endIndex >= childs.length - 1) {
                this._children = Node.ARRAY_EMPTY;
            }
            else {
                childs = childs.splice(beginIndex, endIndex - beginIndex + 1);
            }
            for (let i = 0, n = childs.length; i < n; i++) {
                childs[i].parent = null;
            }
        }
        return this;
    }
    /**
     * 替换子节点
     * @param newChid 新节点
     * @param oldChild 老节点
     * @returns 返回新节点
     */
    replaceChild(newChid, oldChild) {
        const index = this.getChildIndex(oldChild);
        if (index > -1) {
            this._children.splice(index, 1, newChid);
            oldChild.parent = null;
            newChid.parent = this;
            return newChid;
        }
        return null;
    }
    /**
     * 当前容器内是否包含指定的子节点对象
     * @param child 子节点对象
     * @returns 是否包含
     */
    contains(child) {
        let childTemp = child;
        if (childTemp === this)
            return true;
        while (childTemp) {
            if (childTemp.parent === this)
                return true;
            childTemp = child.parent;
        }
        return false;
    }
    /**
     * 帧渲染方法
     * @param renderer 渲染器
     * @param delta 帧间隔时间
     */
    _render(renderer, delta) {
        this._setRenderMethod(renderer);
        if ((!this.onUpdate || this.onUpdate(delta) !== false) && renderer.startDraw(this)) {
            renderer.transform(this);
            this.render(renderer, delta);
            renderer.endDraw(this);
        }
    }
    /**
     * 使用 Canvas 进行渲染
     * @param renderer 渲染器
     * @param delta 帧间隔时间
     */
    _renderCanvas(renderer, delta) {
        const children = this.children;
        for (let i = 0, n = children.length; i < n; i++) {
            const child = children[i];
            child._render(renderer, delta);
        }
    }
    /**
     * 使用 WebGL 进行渲染
     * @param renderer 渲染器
     * @param delta 帧间隔时间
     */
    _renderWebGL(renderer, delta) {
        const children = this.children;
        for (let i = 0, n = children.length; i < n; i++) {
            const child = children[i];
            child._render(renderer, delta);
        }
    }
    /**
     * 子节点发生改变
     * @param child 子节点
     */
    _childChanged(child = null) {
    }
    /**
     * 根据渲染器类型，设置本节点的渲染方法
     * @param renderer 渲染器
     */
    _setRenderMethod(renderer) {
        if (!this.render) {
            this.render = renderer.renderType === RENDER_TYPE.WEBGL ? this._renderWebGL : this._renderCanvas;
        }
    }
}
/**@private */
Node.ARRAY_EMPTY = [];

class Browser {
    /**
     * 获取浏览器当前时间，毫秒
     * @returns 毫秒
     */
    static get now() {
        return window.performance.now() || Date.now();
    }
    /**
     * 获取浏览器的全局对象 window
     * @returns Window
     */
    static get win() {
        if (Browser._initd)
            return Browser._window;
        Browser.__init__();
        return Browser._window;
    }
    /**
     * 获取body的DOM实例
     * @returns Body Element
     */
    static get docElem() {
        if (Browser._initd)
            return Browser._document.documentElement;
        Browser.__init__();
        return Browser._document.documentElement;
    }
    /**
     * 浏览器用户标识
     */
    static get userAgent() {
        if (Browser._initd)
            return Browser._userAgent;
        Browser.__init__();
        return Browser._userAgent;
    }
    /**
     * 是否是 IOS 系统
     */
    static get isIos() {
        if (Browser._initd)
            return Browser._isIos;
        Browser.__init__();
        return Browser._isIos;
    }
    /**
     * 是否是 Android 系统
     */
    static get isAndroid() {
        if (Browser._initd)
            return Browser._isAndroid;
        Browser.__init__();
        return Browser._isAndroid;
    }
    /**
     * 获取文档对象
     */
    static get document() {
        if (Browser._initd)
            return Browser._document;
        Browser.__init__();
        return Browser._document;
    }
    /** 获得设备像素比。*/
    static get pixelRatio() {
        if (Browser._pixelRatio < 0) {
            Browser.__init__();
            if (Browser.userAgent.indexOf("Mozilla/6.0(Linux; Android 6.0; HUAWEI NXT-AL10 Build/HUAWEINXT-AL10)") > -1)
                Browser._pixelRatio = 2;
            else {
                Browser._pixelRatio = (Browser._window.devicePixelRatio || 1);
                if (Browser._pixelRatio < 1)
                    Browser._pixelRatio = 1;
            }
        }
        return Browser._pixelRatio;
    }
    /** 浏览器厂商CSS前缀的js值 */
    static get jsVendor() {
        if (Browser._initd)
            return Browser._jsVendor;
        Browser.__init__();
        return Browser._jsVendor;
    }
    static __init__() {
        if (Browser._initd)
            return Browser._window;
        const win = Browser._window = window;
        Browser._document = win.document;
        const ua = Browser._userAgent = win.navigator.userAgent;
        Browser._isIos = /iphone|ipad|ipod/i.test(ua);
        Browser._isAndroid = /android/i.test(ua);
        const jsVendorMap = {
            'webkit': /webkit/i.test(ua) || /firefox/i.test(ua),
            'o': /opera/i.test(ua),
        };
        Browser._jsVendor = Object.keys(jsVendorMap).find(key => jsVendorMap[key]) || '';
        Browser._initd = true;
        return Browser._window;
    }
}
Browser._initd = false;
/** @private */
Browser._pixelRatio = -1;
Browser._isIos = false;
Browser._isAndroid = false;

class Utils {
    /**获取一个全局唯一ID。*/
    static getGID() {
        return Utils._gid++;
    }
    /**
     * 获取DOM元素在页面中的内容显示区域
     * @param ele DOM元素
     * @returns DOM元素的可视区域，格式为 {x: 0, y: 0, width: 100, height: 100}
     */
    static getElementViewRect(ele) {
        let bounds;
        try {
            bounds = ele.getBoundingClientRect();
        }
        catch (error) {
            bounds = {
                top: ele.offsetTop,
                left: ele.offsetLeft,
                right: ele.offsetLeft + ele.offsetWidth,
                bottom: ele.offsetTop + ele.offsetHeight,
            };
        }
        const offsetX = ((Browser.win.pageXOffset || Browser.docElem.scrollLeft) - (Browser.docElem.clientLeft || 0)) || 0;
        const offsetY = ((Browser.win.pageYOffset || Browser.docElem.scrollTop) - (Browser.docElem.clientTop || 0)) || 0;
        const styles = Browser.win.getComputedStyle ? getComputedStyle(ele) : ele.style;
        const parseIntFn = Browser.win.parseInt;
        const padLeft = (parseIntFn(styles.paddingLeft) + parseIntFn(styles.borderLeftWidth)) || 0;
        const padTop = (parseIntFn(styles.paddingTop) + parseIntFn(styles.borderTopWidth)) || 0;
        const padRight = (parseIntFn(styles.paddingRight) + parseIntFn(styles.borderRightWidth)) || 0;
        const padBottom = (parseIntFn(styles.paddingBottom) + parseIntFn(styles.borderBottomWidth)) || 0;
        const top = bounds.top || 0;
        const left = bounds.left || 0;
        const right = bounds.right || 0;
        const bottom = bounds.bottom || 0;
        return {
            x: left + offsetX + padLeft,
            y: top + offsetY + padTop,
            width: right - padRight - left - padLeft,
            height: bottom - padBottom - top - padTop,
        };
    }
}
/**@private */
Utils._gid = 1;

class Renderer extends HashObject {
    constructor() {
        super();
        this.blendMode = 'source-over';
        this._instanceType = 'Renderer';
    }
    destroy() {
    }
}

class CanvasRenderer extends Renderer {
    constructor(canvas) {
        super();
        this.renderType = RENDER_TYPE.CANVAS;
        this._instanceType = 'CanvasRenderer';
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
    }
    startDraw(target) {
        if (target.visible && target.opacity > 0) {
            if (target.blendMode !== this.blendMode) {
                this.context.globalCompositeOperation = this.blendMode = target.blendMode;
            }
            this.context.save();
            return true;
        }
        return false;
    }
    draw(target) {
        // const ctx = this.context,
        //   w = target.width,
        //   h = target.height
        // // 绘制舞台背景颜色
        // if (target instanceof Stage) {
        //   const bg = target.background
        //   if (bg) {
        //     ctx.fillStyle = bg
        //     ctx.fillRect(0, 0, w, h)
        //   }
        // }
        // // if (target instanceof Sprite) {
        // //   const texture = target.texture
        // //   const img = texture.image, imgW = texture.width, imgH = texture.height
        // //   if (!img || !imgW || !imgH) return
        // //   ctx.drawImage(img, target.x, target.y, imgW, imgH)
        // // }
    }
    endDraw(target) {
        this.context.restore();
    }
    transform(target) {
        const ctx = this.context, matrix = target.transform.matrix, x = target.x, y = target.y, rotation = target.rotation % 360, anchorX = target.anchorX, anchorY = target.anchorY, scaleX = target.scaleX, scaleY = target.scaleY;
        if (matrix) {
            ctx.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.dx, matrix.dy);
        }
        else {
            if (x !== 0 || y !== 0)
                ctx.translate(x, y);
            if (rotation !== 0)
                ctx.rotate(rotation * Math.PI / 180);
            if (scaleX !== 1 || scaleY !== 1)
                ctx.scale(scaleX, scaleY);
            if (anchorX !== 0 || anchorY !== 0)
                ctx.translate(-anchorX, -anchorY);
        }
    }
    remove(target) {
    }
    clear(x, y, width, height) {
        this.context.clearRect(x, y, width, height);
    }
    resize(width, height) {
    }
}

class Stage extends Node {
    constructor(canvas, designWidth, designHeight, viewWidth = document.body.clientWidth, viewHeight = document.body.clientHeight, renderType = RENDER_TYPE.CANVAS) {
        super();
        this.paused = false;
        this.background = '';
        this._instanceType = 'Stage';
        console.log(viewWidth, viewHeight);
        this._initCanvas(canvas, designWidth, designHeight);
        this._initRenderer(canvas, renderType);
        this.updateViewport();
    }
    /**
     * 判断目标对象是否是 Stage
     * @param val 对象
     * @returns
     */
    static isStage(val) {
        return val instanceof Stage;
    }
    /**
     * 更新舞台在页面中的可视区域，即渲染区域。当 Canvas 的样式border|margin|padding等属性更改后，需要调用此方法更新舞台渲染区域
     * @returns 舞台的可视区域
     */
    updateViewport() {
        const canvas = this.canvas;
        let viewport;
        if (canvas.parentNode) {
            viewport = this.viewport = Utils.getElementViewRect(canvas);
        }
        return viewport;
    }
    /**
     * 改变舞台的大小
     * @param width 指定舞台新的宽度
     * @param height 指定舞台新的高度
     * @param forceResize 是否强制改变舞台大小，即不管舞台大小是否相同，强制改变，可确保舞台，画布及视窗之间的尺寸同步
     */
    resize(width, height, forceResize = false) {
        if (forceResize || this.width !== width || this.height !== height) {
            this.width = width;
            this.height = height;
            this.renderer.resize(width, height);
            this.updateViewport();
        }
    }
    /**
     * 舞台帧循环
     * @param dt 游戏循环中使用，触发舞台的更新与渲染，外部不要调用
     */
    tick(dt) {
        if (this.paused)
            return;
        this._render(this.renderer, dt);
    }
    _initCanvas(canvas, designWidth, designHeight) {
        this.canvas = canvas;
        this.width = designWidth;
        this.height = designHeight;
        canvas.width = designWidth;
        canvas.height = designHeight;
    }
    _initRenderer(canvas, renderType) {
        if (renderType === RENDER_TYPE.CANVAS) {
            this.renderer = new CanvasRenderer(canvas);
        }
    }
    _renderCanvas(renderer, delta) {
        renderer.clear(this.x, this.y, this.width, this.height);
        super._renderCanvas(renderer, delta);
    }
    _renderWebGL(renderer, delta) {
        throw new Error('暂未支持 WebGL 方式渲染 Stage');
    }
}

class Texture extends EventDispatcher {
    constructor(src) {
        super();
        this.width = 0;
        this.height = 0;
        this.loaded = false;
        this._instanceType = 'Texture';
        if (src) {
            this.load(src);
        }
    }
    load(src) {
        return new Promise((resolve) => {
            const img = this.image = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                console.log('加载成功');
                img.onload = null;
                this.width = img.naturalWidth;
                this.height = img.naturalHeight;
                this.loaded = true;
                console.log(this);
                resolve(this);
            };
            img.src = src;
        });
    }
}

class Sprite extends Node {
    constructor(src) {
        super();
        this._instanceType = 'Sprite';
        this.texture = new Texture(src);
    }
    get texture() {
        return this._texture;
    }
    set texture(tex) {
        if (typeof tex === 'string') {
            this._texture = new Texture(tex);
        }
        this._texture = tex;
        this.width = this._texture.width;
        this.height = this._texture.height;
    }
    _renderCanvas(renderer, delta) {
        const ctx = renderer.context;
        const texture = this.texture;
        const img = texture.image;
        this.width = texture.width, this.height = texture.height;
        if (img && this.width && this.height && texture.loaded) {
            ctx.drawImage(img, -this.anchorX * this.scaleX, -this.anchorY * this.scaleX, this.width * this.scaleX, this.height * this.scaleY);
        }
        super._renderCanvas(renderer, delta);
    }
    _renderWebGL(renderer, delta) {
        throw new Error('暂未支持 WebGL 方式渲染 Sprite');
    }
}

class Ticker {
    constructor(fps = 60) {
        this._paused = true;
        this._targetFPS = 0;
        this._interval = 0;
        this._intervalId = null;
        this._tickers = [];
        this._lastTime = 0;
        this._tickCount = 0;
        this._tickTime = 0;
        this._measuredFPS = 0;
        this._targetFPS = fps;
        this._interval = 1000 / this._targetFPS;
    }
    /**
     * 启动定时器
     * @param useRAF 是否使用 requestAnimationFrame
     * @returns
     */
    start(useRAF = true) {
        if (this._intervalId)
            return;
        this._lastTime = Browser.now;
        const self = this, interval = this._interval, raf = window.requestAnimationFrame ||
            window[Browser.jsVendor + "RequestAnimationFrame"];
        let runLoop;
        if (useRAF && raf && interval < 17) {
            this._useRAF = true;
            runLoop = function () {
                self._intervalId = raf(runLoop);
                self._tick();
            };
        }
        else {
            runLoop = function () {
                self._intervalId = window.setTimeout(runLoop, interval);
                self._tick();
            };
        }
        this._paused = false;
        runLoop();
    }
    /**
     * 停止定时器
     */
    stop() {
        if (this._useRAF) {
            const cancelRAF = window.cancelAnimationFrame ||
                window[Browser.jsVendor + "CancelAnimationFrame"];
            cancelRAF(this._intervalId);
        }
        else {
            clearTimeout(this._intervalId);
        }
        this._intervalId = null;
        this._lastTime = 0;
        this._paused = true;
    }
    /**
     * 暂停定时器
     */
    pause() {
        this._paused = true;
    }
    /**
     * 恢复定时器
     */
    resume() {
        this._paused = false;
    }
    /**
     * 获得测定的运行时帧率
     */
    getMeasuredFPS() {
        return Math.min(this._measuredFPS, this._targetFPS);
    }
    /**
     * 添加定时器对象
     * @param tickObj 定时器对象
     */
    addTick(tickObj) {
        if (!tickObj || typeof tickObj.tick != "function") {
            throw new Error("Ticker: The tick object must implement the tick method.");
        }
        this._tickers.push(tickObj);
    }
    /**
     * 移除定时器对象
     * @param tickObj 定时器对象
     */
    removeTick(tickObj) {
        const tickers = this._tickers, index = tickers.indexOf(tickObj);
        if (index >= 0) {
            tickers.splice(index, 1);
        }
    }
    /**
     * 下次定时回调
     * @param callback 回调方法
     * @returns
     */
    nextTick(callback) {
        const that = this;
        const tickObj = {
            tick: function (dt) {
                that.removeTick(tickObj);
                callback && callback();
            },
        };
        that.addTick(tickObj);
        return tickObj;
    }
    /**
     * 清空所有定时器
     */
    clear() {
        const tickers = this._tickers;
        tickers.length = 0;
    }
    /**
     * 延迟指定的时间后调用回调，类似 setTimeout
     * @param callback 回调方法
     * @param duration 延迟时间
     */
    timeout(callback, duration) {
        const that = this;
        const targetTime = Browser.now + duration;
        const tickObj = {
            tick: function () {
                const nowTime = Browser.now;
                const dt = nowTime - targetTime;
                if (dt >= 0) {
                    that.removeTick(tickObj);
                    callback();
                }
            },
        };
        that.addTick(tickObj);
        return tickObj;
    }
    /**
     * 每隔一定的时间执行一次回调方法，类似 setInterval
     * @param callback 回调方法
     * @param duration 延时
     * @returns
     */
    interval(callback, duration) {
        const that = this;
        let targetTime = Browser.now + duration;
        const tickObj = {
            tick: function () {
                let nowTime = Browser.now;
                const dt = nowTime - targetTime;
                if (dt >= 0) {
                    if (dt < duration) {
                        nowTime -= dt;
                    }
                    targetTime = nowTime + duration;
                    callback();
                }
            },
        };
        that.addTick(tickObj);
        return tickObj;
    }
    /**
     * 每一帧执行的方法
     * @returns
     */
    _tick() {
        if (this._paused)
            return;
        const startTime = Browser.now, deltaTime = startTime - this._lastTime, tickers = this._tickers;
        //calculates the real fps
        if (++this._tickCount >= this._targetFPS) {
            this._measuredFPS =
                (1000 / (this._tickTime / this._tickCount) + 0.5) >> 0;
            this._tickCount = 0;
            this._tickTime = 0;
        }
        else {
            this._tickTime += startTime - this._lastTime;
        }
        this._lastTime = startTime;
        const tickersCopy = tickers.slice(0);
        for (let i = 0, len = tickersCopy.length; i < len; i++) {
            tickersCopy[i].tick(deltaTime);
        }
    }
}

class Tyro2d {
    /**
     * 开始游戏
     * @param stage 舞台对象
     * @param fps 帧率
     * @returns
     */
    static start(stage, fps) {
        if (Tyro2d.stage)
            return;
        Tyro2d.stage = stage;
        Tyro2d.ticker = new Ticker(fps);
        Tyro2d.ticker.addTick(stage);
        Tyro2d.ticker.start();
    }
    /**
     * 暂停游戏
     */
    static pause() {
        Tyro2d.ticker.pause();
    }
    /**
     * 继续游戏
     */
    static resume() {
        Tyro2d.ticker.resume();
    }
    /**
     * 终止游戏
     */
    static stop() {
        Tyro2d.ticker.stop();
    }
    /**
     * 销毁游戏实例
     */
    static destroy() {
        Tyro2d.stage.destroy();
        Tyro2d.eventBus.destroy();
        Tyro2d.ticker.stop();
        Tyro2d.ticker.clear();
        Tyro2d.stage = null;
        Tyro2d.ticker = null;
    }
}
Tyro2d.Event = Event;

export { Event$1 as Event, EventDispatcher, MathTool, Node, Sprite, Stage, Ticker, Tyro2d, Utils, Vector2d };
