const SVG_URI = "http://www.w3.org/2000/svg";

export interface SVGWrapper<T> {
    svgEl: T
}

export function createSVGEl<T>(tagName: string): T {
    return document.createElementNS(SVG_URI, tagName) as T;
}

export class SVGWrapper<T> {
    svgEl: T

    constructor(tagName: string) {
        this.svgEl = createSVGEl(tagName);
    }
}