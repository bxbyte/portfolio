import { SVGWrapper, createSVGEl } from "../svg-utils.mjs";

class Mesh implements SVGWrapper<SVGGElement> {
    svgEl: SVGPathElement
    startEl: SVGPathElement
    endEl: SVGPathElement
    childs: SVGPathElement[]
    fpath: string

    constructor(svgEl: SVGGElement) {
        this.svgEl = createSVGEl("path");
        this.startEl = svgEl.querySelector(".start");
        this.endEl = svgEl.querySelector(".end");
        this.childs = Array.from(svgEl.querySelectorAll(":not(.end,.start)"));
        this.fpath = svgEl.dataset.fpath;
        let target = svgEl.ownerSVGElement.querySelector(svgEl.dataset.target);
        target.appendChild(this.svgEl);
        this.svgEl.style.fill = "white";
    }

    upd(t: number) {
        let path = this.childs.map(pathEl => {
                let pt = pathEl.getPointAtLength(t * pathEl.getTotalLength());
                return `L ${pt.x} ${pt.y}`;
            }).join(),
            startPt = this.startEl.getPointAtLength(t * this.startEl.getTotalLength()),
            endPt = this.endEl.getPointAtLength(t * this.endEl.getTotalLength());
        this.svgEl.setAttribute('d', eval(`\`${this.fpath}\``));
    }
}

class SVGMesh extends HTMLElement implements SVGWrapper<SVGSVGElement> {
    static tagName = "mesh-wrapper"
    svgEl: SVGSVGElement
    meshs: Mesh[]

    async connectedCallback() {
        this.innerHTML = await (await fetch(this.dataset.src)).text();
        this.svgEl = this.firstElementChild as SVGSVGElement;
        this.meshs = Array.from(this.svgEl.querySelectorAll(".mesh")).map(meshGroup => new Mesh(meshGroup as SVGGElement));
        let i = 0,
            a = 1 / 10,
            id = setInterval(() => {
            this.meshs.forEach(mesh => mesh.upd(i));
            i+=a;
            if (a >= 1)
                clearInterval(id);
        }, 100);
    }
}

customElements.define(SVGMesh.tagName, SVGMesh);