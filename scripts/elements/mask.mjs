import { onResizeView, onView } from "./view.mjs";

class MaskedDiv extends HTMLDivElement {
    refreshing = true;
    maskChilds = new Set();

    /**
     * Setup 
     */
    async connectedCallback() {
        this.cvs = document.createElement("canvas");
        this.ctx = this.cvs.getContext("2d");

        onResizeView(this.parentElement, () => {
            let parentBox = this.parentElement.getBoundingClientRect();
            this.cvs.width = parentBox.width;
            this.cvs.height = parentBox.height;
        })
        
        document.querySelectorAll(`[mask=${this.id}]`).forEach(maskEl => {
            onView(maskEl, () => this.maskChilds.add(maskEl), () => this.maskChilds.delete(maskEl));
            onResizeView(maskEl, this.render.bind(this));
        });
    }

    /**
     * Render mask on element
     */
    render() {
        this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
        this.drawChildMasks();
        this.ctx.fill();
        this.refresh();
    }

    /**
     * Draw every visible child on mask
     */
    drawChildMasks() {
        this.maskChilds.forEach(async maskEl => {
            this.ctx.roundRect(maskEl.offsetLeft, maskEl.offsetTop, maskEl.offsetWidth, maskEl.offsetHeight, parseInt(getComputedStyle(maskEl).borderRadius))
        });
    }

    /**
     * Refresh mask on element
     */
    refresh() {
        this.style.mask = `url(${this.cvs.toDataURL()})`;
    }
}

customElements.define("masked-box", MaskedDiv, { extends: 'div' });