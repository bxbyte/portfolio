import { onResizeView } from "./view.mjs"

class MaskedDiv extends HTMLDivElement {

    /**
     * Setup 
     */
    async connectedCallback() {
        this.masks = Array.from(document.querySelectorAll(`[mask="#${this.id}"]`)).map(
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
        onResizeView(this.parentElement, this.mooveMasks.bind(this));
    }

    /**
     * Update mask elements
     */
    mooveMasks() {
        this.masks.forEach(maskEl => {
            let parentBox = this.parentElement.getBoundingClientRect(),
                box = maskEl.parentElement.getBoundingClientRect();
            maskEl.style.transform = `translate(${parentBox.x - box.x}px, ${parentBox.y - box.y}px)`;
            maskEl.style.width = `${~~(parentBox.width)}px`;
            maskEl.style.height = `${~~(parentBox.height)}px`;
        })
    }
}

customElements.define("masked-box", MaskedDiv, { extends: 'div' });