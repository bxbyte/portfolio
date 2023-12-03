import { SVGWrapper } from "../svg-utils.mjs";
export class GraphNode extends SVGWrapper {
    nodes;
    p;
    constructor(p) {
        super("circle");
        this.nodes = new Map();
        this.p = p;
    }
    upd() {
        this.svgEl.setAttribute('cx', `${this.p.x}`);
        this.svgEl.setAttribute('cy', `${this.p.y}`);
    }
    transfertFrom(tcall) {
        tcall.viewedNodes.add(this);
        this.nodes.forEach((link, nodeEnd) => {
            if (tcall.viewedNodes.has(nodeEnd))
                return;
            tcall.callback(this, nodeEnd, link);
            nodeEnd.transfertFrom(tcall);
        });
    }
}
