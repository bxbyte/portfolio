const CURSED_CHARSET = ['⬚', '$', '/', '﹏', '﹍', 'A', 'Z', '▒', '░', '⠻', '⛦'];

function toSpanEl(text) {
    let spanEl = document.createElement("span");
    spanEl.innerHTML = text;
    return spanEl;
}

async function wait(timems) {
    return new Promise(res => setTimeout(res, timems))
}

async function waitNext(callback, node, deltatime) {
    return new Promise(res => {
        let nextNode = callback(node);
        if (nextNode){
            setTimeout(async () => {
                await waitNext(callback, nextNode, deltatime);
                res(); 
            }, deltatime);}
        else res();
    })
}

class AnimatedText extends HTMLSpanElement {

    async connectedCallback() {
        this.replaceChildren(...(this.chars = [...this.innerText].map(toSpanEl)));
        if (this.dataset.method)
            await ({
                fliping: this.animFliping.bind(this),
                cursed: this.animCursed.bind(this)
            }[this.dataset.method])();
    }

    async animFliping() {
        await waitNext(node => {
            node.classList.add("on")
            return node.nextElementSibling
        }, this.firstElementChild, 200);
        await wait(200);
        this.chars.forEach(char => char.classList.remove("on"))
    }

    async animCursed() {
        this.chars.forEach((charEl) => {
            let finalChar = charEl.innerText,
                remainingChars = Array.from(CURSED_CHARSET),
                idInterval = setInterval(() => {
                    if (remainingChars.length == 0 || Math.random() < 1 / remainingChars.length ) {
                        charEl.innerText = finalChar;
                        clearInterval(idInterval);
                        return;
                    }
                    charEl.innerText = remainingChars.splice(~~(Math.random() * remainingChars.length), 1)[0];
                }, 100);
            charEl.innerText = remainingChars.splice(~~(Math.random() * remainingChars.length), 1)[0];
        })
    }
}

customElements.define("anim-text", AnimatedText, {extends: 'span'})