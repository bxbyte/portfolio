import { onView } from "./view.mjs"

const ANIMATED_CLASS_NAME = "animated",
    CURSED_CHARSET = ['⬚', '$', '/', '﹏', '﹍', 'A', 'Z', '▒', '░', '⠻', '⛦'];
    
/**
 * Create a span element with a content
 * @param {*} text  Span content
 * @returns {HTMLSpanElement} the span element
 */
function toSpanEl(text) {
    let spanEl = document.createElement("span");
    spanEl.innerHTML = text;
    return spanEl;
}

class AnimatedText extends HTMLSpanElement {
    timeoutIds = []
    intervalIds = []

    /**
     * Setup & prepare to animate when on viewport
     */
    connectedCallback() {
        this.defaultTxt = this.innerText;
        this.replaceChildren(...(this.chars = [...this.innerText].map(toSpanEl)));
        onView(this, this.animationCallback.bind(this), this.cancel.bind(this));
    }

    /***
     * Call defined animation method
     */
    async animationCallback () {
        if (!this.dataset.method)
            return
        await ({
            next: this.animNext.bind(this),
            curse: this.animCurse.bind(this)
        }[this.dataset.method])();
    }

    /**
     * Clear current animation
     */
    clear() {
        this.chars.forEach(charEl => charEl.removeAttribute("class"));
        this.timeoutIds = [];
        this.intervalIds = [];
    }

    /**
     * Cancel current animation
     */
    cancel() {
        this.timeoutIds.forEach(id => clearTimeout(id));
        this.intervalIds.forEach(id => clearInterval(id));
        this.chars.forEach((charEl, i) => charEl.innerText = this.defaultTxt.charAt(i));
        this.clear();
    }

    /**
     * Use setTimeout with this to cancel animation if needed
     * @param {Function} callback   setTimeout callback
     * @param {Number} timeout      setTimeout timeout
     * @returns {Number}            setTimeout id
     */
    setTimeOut(callback, timeout) {
        let id = setTimeout(callback, timeout);
        this.timeoutIds.push(id);
        return id;
    }

    /**
     * Use setInterval with this to cancel animation if needed
     * @param {Function} callback   setInterval callback
     * @param {Number} timeout      setInterval timeout
     * @returns {Number}            setInterval id
     */
    setInterval(callback, timeout) {
        let id = setInterval(callback, timeout);
        this.intervalIds.push(id);
        return id;
    }

    /**
     * Wait for a moment
     * @param {Number} timeout  Timeout to wait
     * @returns {Promise<undefined>}
     */
    async wait(timeout) {
        return new Promise(res => this.setTimeout(res, timeout));
    }

    /**
     * Wait for a moment on a element before calling back to the next one
     * @param {(Element) => Element | undefined} callback   Call one a element returning the next one
     * @param {Element} element                             First element
     * @param {Number} deltatimeout                         Timeout between call
     * @returns {Promise<undefined>}
     */
    async waitNext(callback, element, deltatimeout) {
        return new Promise(res => {
            let nextElement = callback(element);
            if (nextElement)
                this.setTimeout(async () => {
                    await waitNext(callback, nextElement, deltatimeout);
                    res(); 
                }, deltatimeout);
            else res();
        })
    }
    
    /**
     * Animate by addind ANIMATED_CLASS_NAME to a char one after another
     */
    async animNext() {
        await this.waitNext(node => {
            node.classList.add(ANIMATED_CLASS_NAME)
            return node.nextElementSibling
        }, this.firstElementChild, 200);
        await this.wait(200);
        this.clear();
    }

    /**
     * Animate by randomly choosing a char in CURSED_CHARSET
     */
    async animCurse() {
        this.chars.forEach((charEl) => {
            let finalChar = charEl.innerText,
                remainingChars = Array.from(CURSED_CHARSET),
                idInterval = this.setInterval(() => {
                    charEl.innerText = remainingChars.splice(~~(Math.random() * remainingChars.length), 1)[0];
                    if (remainingChars.length == 0 || Math.random() < 1 / remainingChars.length ) {
                        charEl.innerText = finalChar;
                        clearInterval(idInterval);
                    }
                }, 100);
            charEl.innerText = remainingChars.splice(~~(Math.random() * remainingChars.length), 1)[0];
        })
    }
}

customElements.define("anim-text", AnimatedText, {extends: 'span'})