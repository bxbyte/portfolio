
class MaskDiv extends HTMLDivElement {

    async connectedCallback() {
        let maskedTargetEl = this.parentElement.querySelector(".masked"),
            maskEl = this.querySelector(".mask");

        if (!maskEl) {
            maskEl = document.createElement("div");
            maskEl.classList.add("mask")
            this.insertBefore(maskEl, this.firstChild);
        }

        window.addEventListener("resize", () => {
            let parentBox = this.parentElement.getBoundingClientRect(),
                box = this.getBoundingClientRect();
            maskEl.style.transform = `translate(${parentBox.x - box.x}px, ${parentBox.y - box.y}px)`;
        })
        
        let parentBox = this.parentElement.getBoundingClientRect(),
            box = this.getBoundingClientRect();
        maskEl.style.transform = `translate(${parentBox.x - box.x}px, ${parentBox.y - box.y}px)`;

        maskedTargetEl.childNodes.forEach(child => maskEl.appendChild(child.cloneNode(true)));
    }
}

customElements.define("mask-box", MaskDiv, { extends: 'div' });