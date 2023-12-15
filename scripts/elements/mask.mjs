import { onResizeView } from "./view.mjs";
import { GridEvent } from "./grid.mjs";
import { renderFrame, getCSSDuration } from "../utils.mjs";

class MaskedDiv extends HTMLDivElement {

    /**
     * Setup 
     */
    async connectedCallback() {
        this.masks = Array.from(document.querySelectorAll(`[mask="${this.id}"]`)).map(
            el => {
                let maskEl = el.querySelector(".mask");
                if (!maskEl) {
                    maskEl = document.createElement("div");
                    maskEl.classList.add("mask");
                    el.insertBefore(maskEl, el.firstChild);
                }
                this.childNodes.forEach(child => maskEl.appendChild(child.cloneNode(true)));
                return maskEl;
            }
        );
        onResizeView(this.parentElement, this.updMask.bind(this));
        this.parentElement.addEventListener(GridEvent.type, () => setTimeout(renderFrame(this.updMaskPos.bind(this)), getCSSDuration(this.parentElement)));
    }

    /**
     * Update mask elements position & size
     */
    updMask() {
        this.masks.forEach(maskEl => {
            let parentBox = this.parentElement.getBoundingClientRect(),
                box = maskEl.parentElement.getBoundingClientRect();
            maskEl.style.left = `${parentBox.x - box.x}px`;
            maskEl.style.top = `${parentBox.y - box.y}px`;
            maskEl.style.width = `${parentBox.width}px`;
            maskEl.style.height = `${parentBox.height}px`;
        })
    }

    /**
     * Update mask elements position
     */
    updMaskPos() {
        this.masks.forEach(maskEl => {
            let parentBox = this.parentElement.getBoundingClientRect(),
                box = maskEl.parentElement.getBoundingClientRect();
            maskEl.style.left = `${parentBox.x - box.x}px`;
            maskEl.style.top = `${parentBox.y - box.y}px`;
        })
    }
}

customElements.define("masked-box", MaskedDiv, { extends: 'div' });