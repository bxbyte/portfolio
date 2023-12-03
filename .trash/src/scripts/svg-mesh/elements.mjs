import { createSVGEl } from "../svg-utils.mjs";
class Mesh {
    svgEl;
    startEl;
    endEl;
    childs;
    fpath;
    constructor(svgEl) {
        this.svgEl = createSVGEl("path");
        this.startEl = svgEl.querySelector(".start");
        this.endEl = svgEl.querySelector(".end");
        this.childs = Array.from(svgEl.querySelectorAll(":not(.end,.start)"));
        this.fpath = svgEl.dataset.fpath;
        let target = svgEl.ownerSVGElement.querySelector(svgEl.dataset.target);
        target.appendChild(this.svgEl);
        this.svgEl.style.fill = "white";
    }
    upd(t) {
        let path = this.childs.map(pathEl => {
            let pt = pathEl.getPointAtLength(t * pathEl.getTotalLength());
            return `L ${pt.x} ${pt.y}`;
        }).join(), startPt = this.startEl.getPointAtLength(t * this.startEl.getTotalLength()), endPt = this.endEl.getPointAtLength(t * this.endEl.getTotalLength());
        this.svgEl.setAttribute('d', eval(`\`${this.fpath}\``));
    }
}
class SVGMesh extends HTMLElement {
    static tagName = "mesh-wrapper";
    svgEl;
    meshs;
    async connectedCallback() {
        this.innerHTML = await (await fetch(this.dataset.src)).text();
        this.svgEl = this.firstElementChild;
        this.meshs = Array.from(this.svgEl.querySelectorAll(".mesh")).map(meshGroup => new Mesh(meshGroup));
        let i = 0, a = 1 / 10, id = setInterval(() => {
            this.meshs.forEach(mesh => mesh.upd(i));
            i += a;
            if (a >= 1)
                clearInterval(id);
        }, 100);
    }
}
customElements.define(SVGMesh.tagName, SVGMesh);
