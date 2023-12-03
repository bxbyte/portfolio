import { createSVGEl } from "../svg-utils.mjs";
import { Particule, Vector } from "./geometry.mjs";
import { GraphNode } from "./node.mjs";
import { GraphLink } from "./link.mjs";
import { GraphSimulation } from "./handlers.mjs";
import { PARTICULE_RADIUS } from "./geometry.mjs";
import { WaweTrasfer } from "./transferCall.mjs";

class GraphElement extends HTMLElement {
    #pt;
    convMatrix;
    bbox;
    center;
    svgEl;
    grpNodeEl;
    grpLinkEl;
    nodes;
    links;
    handler;
    selectedNode = undefined;
    static tagName = "graph-wrapper";

    connectedCallback() {
        this.svgEl = createSVGEl("svg");
        this.svgEl.appendChild(this.grpLinkEl = createSVGEl("g"));
        this.svgEl.appendChild(this.grpNodeEl = createSVGEl("g"));
        this.appendChild(this.svgEl);
        this.svgEl.setAttribute("viewBox", `0 0 100 100`);
        this.setBbox();
        this.nodes = new Set();
        this.links = new Set();
        this.handler = new GraphSimulation();
        this.handler.setup(this);
        this.setEvents();
        setInterval(() => {
            this.handler.update(this);
        }, 1);
    }

    setBbox() {
        this.#pt = this.svgEl.createSVGPoint();
        this.convMatrix = this.svgEl.getScreenCTM()?.inverse();
        this.bbox = this.svgEl.viewBox.baseVal;
        this.bbox.width -= PARTICULE_RADIUS;
        this.bbox.height -= PARTICULE_RADIUS;
        this.center = new Vector(this.bbox.x + this.bbox.width / 2, this.bbox.y + this.bbox.height / 2);
    }

    projectPt(x, y) {
        this.#pt.x = x;
        this.#pt.y = y;
        return this.#pt.matrixTransform(this.convMatrix);
    }

    setEvents() {
        window.addEventListener("resize", () => this.setBbox());
        let stopMoveNode = () => {
            if (!this.selectedNode)
                return;
            this.selectedNode = null;
            this.classList.remove("edit");
        };
        this.addEventListener("mouseup", stopMoveNode);
        this.addEventListener("touchend", stopMoveNode);
        this.addEventListener("mouseleave", stopMoveNode);
        this.addEventListener("mousemove", ({ pageX, pageY }) => {
            if (!this.selectedNode)
                return;
            this.selectedNode.p.from(this.projectPt(pageX, pageY));
            this.selectedNode.upd();
        });
        this.addEventListener("touchmove", ({ targetTouches: [{ pageX, pageY }] }) => {
            if (!this.selectedNode)
                return;
            this.selectedNode.p.from(this.projectPt(pageX, pageY));
            this.selectedNode.upd();
        });
    }

    setNodeControl(node) {
        let nodeSeletectedEv = () => {
            this.selectedNode = node;
            this.classList.add("edit");
        };
        node.svgEl.addEventListener("mousedown", nodeSeletectedEv);
        node.svgEl.addEventListener("touchstart", nodeSeletectedEv);
        node.svgEl.addEventListener("dblclick", () => node.transfertFrom(new WaweTrasfer(node.p, 10)));
    }

    newNode(p = undefined) {
        let node = new GraphNode(p || new Particule());
        this.grpNodeEl.appendChild(node.svgEl);
        this.setNodeControl(node);
        this.nodes.add(node);
        return node;
    }

    growNode(nodeStart, minRadius = 2, maxRadius = 4) {
        let nodeEnd = this.newNode(new Particule().randomizeInCircle(nodeStart.p, minRadius, maxRadius));
        this.bindNode(nodeStart, nodeEnd);
        return nodeEnd;
    }

    bindNode(nodeStart, nodeEnd) {
        let link = nodeStart.nodes.get(nodeEnd);
        if (link)
            return link;
        link = new GraphLink(nodeStart, nodeEnd);
        this.grpLinkEl.appendChild(link.svgEl);
        nodeStart.nodes.set(nodeEnd, link);
        nodeEnd.nodes.set(nodeStart, link);
        this.links.add(link);
        return link;
    }

    unBindNode(nodeStart, nodeEnd) {
        let link = nodeStart.nodes.get(nodeEnd);
        if (!link)
            return;
        this.links.delete(link);
        this.grpLinkEl.removeChild(link.svgEl);
        nodeStart.nodes.delete(nodeEnd);
        nodeEnd.nodes.delete(nodeStart);
    }
}

customElements.define(GraphElement.tagName, GraphElement);
