
class MaskedDiv extends HTMLDivElement {

    async connectedCallback() {
        this.masks = Array.from(document.querySelectorAll(`[mask="#${this.id}"]`)).map(
            el => {
                let maskEl = el.querySelector(".mask");
                if (!maskEl) {
                    maskEl = document.createElement("div");
                    maskEl.classList.add("mask")
                    el.insertBefore(maskEl, el.firstChild);
                }
                this.childNodes.forEach(child => maskEl.appendChild(child.cloneNode(true)));
                return maskEl;
            }
        );

        window.addEventListener("resize", this.mooveMasks.bind(this));
        this.mooveMasks();
    }

    mooveMasks() {
        this.masks.forEach(maskEl => {
            let parentBox = this.parentElement.getBoundingClientRect(),
                box = maskEl.parentElement.getBoundingClientRect();
                console.log(`translate(${parentBox.x - box.x}px, ${parentBox.y - box.y}px)`)
            maskEl.style.transform = `translate(${parentBox.x - box.x}px, ${parentBox.y - box.y}px)`;
        })
    }
}

customElements.define("masked-box", MaskedDiv, { extends: 'div' });