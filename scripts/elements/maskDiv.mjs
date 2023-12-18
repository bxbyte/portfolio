import { onResize } from "../size.mjs";

class MaskedDiv extends HTMLDivElement {

    /**
     * Setup 
     */
    async connectedCallback() {
        this.cvs = document.createElement("canvas");
        this.ctx = this.cvs.getContext("2d");
        let parentBox = this.parentElement.getBoundingClientRect();
        this.cvs.width = parentBox.width;
        this.cvs.height = parentBox.height;

        onResize(this.parentElement, () => {
            let parentBox = this.parentElement.getBoundingClientRect();
            this.cvs.width = parentBox.width;
            this.cvs.height = parentBox.height;
            requestAnimationFrame(this.render.bind(this));
        })

        this.maskChilds = new Set(document.querySelectorAll(`[data-mask=${this.id}]`))
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
        this.style.mask = this.style.webkitMask =`url(${this.cvs.toDataURL()})`;
    }
}

customElements.define("masked-box", MaskedDiv, { extends: 'div' });