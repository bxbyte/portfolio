import { onView } from "./view.mjs";
import { getCSSDuration } from "../utils.mjs";

const END_CLASS_NAME = "end",
    ANIMATED_CLASS_NAME = "animated",
    CURSED_CHARSET = ['⬚', '$', '/', 'A', 'Z', '▒', '░', '⠻', '⛦'];

/**
 * Turn a string into a span element
 * @param {*} text  Span content
 * @returns {HTMLSpanElement} the span element
 */
function toSpanEl(text) {
    let spanEl = document.createElement("span");
    spanEl.innerHTML = text;
    return spanEl;
}

/**
 * Get computed CSS duration of char
 * @param {String} className    Class of targeted char style.
 * @param {String} prop         Name of propriety transition / animation (default)
 * @returns {Number}
 */
function getCharDuration(className, prop = "animation") {
    let parentElement = document.createElement("span");
    parentElement.className = className;
    let element = document.createElement("span");
    element.classList.add(ANIMATED_CLASS_NAME)
    parentElement.appendChild(element);
    document.body.appendChild(parentElement);
    let time = parseFloat(getComputedStyle(element)[`${prop}Duration`]) * 1e3;
    parentElement.remove();
    element.remove();
    return time;
}

class AnimatedText extends HTMLSpanElement {
    timeoutIds = []
    intervalIds = []
    methodProxy = {
        next: this.animNext.bind(this),
        curse: this.animCurse.bind(this),
    }

    /**
     * Setup & prepare to animate when on viewport
     */
    connectedCallback() {
        this.defaultTxt = this.innerText;
        this.replaceChildren(...(this.chars = [...this.innerText].map(toSpanEl)));
        if (!(this.dataset.method in this.methodProxy))
            return
        onView(this, this.animationCallback.bind(this), this.cancel.bind(this));
    }

    /***
     * Call defined animation method
     */
    async animationCallback () {
        await this.methodProxy[this.dataset.method]();
    }

    /**
     * Clear current animation
     */
    clear() {
        this.classList.remove(END_CLASS_NAME);
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
    setTimeout(callback, timeout) {
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
     * @param {(el: Element, next: (el: Element) => Promise<undefined>) => Promise<undefined>} callback   Call one a element returning the next one
     * @param {Element} element                             First element
     * @returns {Promise<undefined>}
     */
    async next(callback, element) {
        async function next(nextElement) {
            if (nextElement) await callback(nextElement, next.bind(this));
        }
        await callback(element, next.bind(this));
    }

    /**
     * Animate by addind ANIMATED_CLASS_NAME to a char one after another
     */
    async animNext() {
        await this.next(async (charEl, next) => {
            charEl.classList.add(ANIMATED_CLASS_NAME)
            await this.wait(this.dataset.delta)
            await next(charEl.nextElementSibling);
        }, this.firstElementChild);
        await this.wait(getCharDuration(this.className));
        this.clear();
        this.classList.add(END_CLASS_NAME);
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