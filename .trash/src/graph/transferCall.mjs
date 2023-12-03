import { Vector } from "./geometry.mjs";
export class TransferCall {
    viewedNodes;
    constructor() {
        this.viewedNodes = new Set();
    }
}
export class WaweTrasfer extends TransferCall {
    origin;
    f;
    constructor(origin, f) {
        super();
        this.origin = origin;
        this.f = f;
    }
    callback(startNode, endNode, link) {
        let v = Vector.dist(this.origin, endNode.p), d = v.length();
        endNode.p.addForce(v.div(d).mult(this.f));
    }
}
