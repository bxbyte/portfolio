import { Vector } from "./geometry.mjs";
import { PARTICULE_RADIUS } from "./geometry.mjs";
export class GraphSimulation {
    centerForce = .1;
    nodeForce = -1;
    linkForce = 1;
    linkLength = 1;
    topForceStep = 1;
    setup(graph) {
        let nGraph = 20, minNode = 3, maxNode = 20 - minNode, pn = .1;
        for (let i = 0; i < nGraph; i++) {
            let length = ~~((maxNode + 1) * Math.random()) + minNode - 1, nodes = Array.from({ length }, () => (graph.newNode()));
            nodes.forEach(nodeStart => {
                nodeStart.p.randomizeInRect(graph.bbox);
                let n = ~~(Math.random() * (length * pn + 1) + 1);
                for (let i = 0; i < n; i++) {
                    let j = ~~(Math.random() * length), k = j, nodeEnd = nodes[k];
                    while (nodeStart.nodes.has(nodeEnd) && k != j)
                        nodeEnd = nodes[(k = (k + 1) % length)];
                    graph.bindNode(nodeStart, nodeEnd);
                }
            });
        }
        graph.nodes.forEach(node => {
            node.upd();
        });
    }
    update(graph) {
        graph.nodes.forEach(async (nodeStart) => {
            if (graph.selectedNode == nodeStart)
                return;
            graph.nodes.forEach(async (nodeEnd) => {
                if (nodeStart == nodeEnd)
                    return;
                let v = Vector.dist(nodeStart.p, nodeEnd.p), d = v.length();
                if (d < PARTICULE_RADIUS)
                    return;
                let f = d < PARTICULE_RADIUS ?
                    -d :
                    nodeStart.nodes.has(nodeEnd) ?
                        this.linkForce * (d - this.linkLength) :
                        this.nodeForce * (nodeStart.nodes.size + nodeEnd.nodes.size + 1) / (d ** 2);
                if (f > this.topForceStep)
                    f = this.topForceStep;
                nodeStart.p.addForce(v.div(d).mult(f));
            });
            let v = Vector.dist(nodeStart.p, graph.center), d = v.length();
            let f = this.centerForce * d ** 2;
            if (f > this.topForceStep)
                f = this.topForceStep;
            nodeStart.p.addForce(v.div(d).mult(f));
        });
        graph.nodes.forEach(async (node) => {
            node.p.upd();
            node.upd();
        });
        graph.links.forEach(async (link) => {
            link.upd();
        });
    }
}
