const SVG_URI = "http://www.w3.org/2000/svg";
export function createSVGEl(tagName) {
    return document.createElementNS(SVG_URI, tagName);
}
export class SVGWrapper {
    svgEl;
    constructor(tagName) {
        this.svgEl = createSVGEl(tagName);
    }
}
