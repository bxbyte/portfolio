export class BackCanvasEl extends HTMLCanvasElement {

    connectedCallback() {
        
    }
}

customElements.define("background-canvas", BackCanvasEl, {extends: "canvas"})