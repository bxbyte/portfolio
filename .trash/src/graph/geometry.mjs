export const PARTICULE_RADIUS = .5, SMOOTH_FACTOR = .5;
export class Vector {
    x;
    y;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    randomizeInRect(rect) {
        this.x = (rect.width - rect.x) * Math.random() + rect.x;
        this.y = (rect.height - rect.y) * Math.random() + rect.y;
        return this;
    }
    randomizeInCircle(v, minRadius, maxRadius) {
        let a = Math.random() * Math.PI * 2, r = maxRadius * Math.random() + minRadius;
        this.x = v.x + Math.cos(a) * r;
        this.y = v.y + Math.sin(a) * r;
        return this;
    }
    copy() {
        return new Vector(this.x, this.y);
    }
    from({ x, y }) {
        this.x = x;
        this.y = y;
        return this;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    sub(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    mult(v) {
        this.x *= v;
        this.y *= v;
        return this;
    }
    div(v) {
        this.x /= v;
        this.y /= v;
        return this;
    }
    static dist(v1, v2) {
        return new Vector(v2.x - v1.x, v2.y - v1.y);
    }
    length() {
        return Math.hypot(this.x, this.y);
    }
    normalize() {
        let d = this.length();
        this.x /= d;
        this.y /= d;
        return this;
    }
    reset() {
        this.x = 0;
        this.y = 0;
        return this;
    }
    toString() {
        return `${this.x},${this.y}`;
    }
}
export class Particule extends Vector {
    v;
    a;
    constructor(x = undefined, y = undefined) {
        super(x, y);
        this.v = new Vector();
        this.a = new Vector();
    }
    upd() {
        this.v.add(this.a);
        this.add(this.v.mult(SMOOTH_FACTOR));
        this.a.reset();
    }
    addForce(force) {
        this.a.add(force);
    }
    cut(bbox) {
        if (bbox.x > this.x) {
            this.v.x *= -1;
            this.x = bbox.x;
        }
        if (bbox.width - 1 < this.x) {
            this.v.x *= -1;
            this.x = bbox.width - 1;
        }
        if (bbox.y > this.y) {
            this.v.y *= -1;
            this.y = bbox.y;
        }
        if (bbox.height - 1 < this.y) {
            this.v.y *= -1;
            this.y = bbox.height - 1;
        }
        return this;
    }
}
