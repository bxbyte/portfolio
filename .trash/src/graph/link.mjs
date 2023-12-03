import { SVGWrapper } from "../svg-utils.mjs";
import { Vector } from "./geometry.mjs";
export class GraphLink extends SVGWrapper {
    nodeStart;
    nodeEnd;
    constructor(nodeStart, nodeEnd) {
        super("path");
        this.nodeStart = nodeStart;
        this.nodeEnd = nodeEnd;
    }
    upd() {
        this.svgEl.setAttribute('d', `M${this.nodeStart.p} L${this.nodeEnd.p}`);
    }
    getVector() {
        return Vector.dist(this.nodeStart.p, this.nodeEnd.p);
    }
}
