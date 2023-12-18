import "./elements/asciiText.mjs";
import "./elements/animText.mjs";
import "./elements/maskDiv.mjs";

import { viewObserver } from "./view.mjs";
import { onViewScroll, getScrollFactor } from "./scroll.mjs";

// Setup
// -----

// Every sections are view sensitive
document.querySelectorAll("main > section").forEach(element => viewObserver.observe(element));

/**
 * Extract the function to call from some element's scroll attributes
 * @param {Element} element 
 * @return {(scrollFactor: Number) => void}
 */
function parseScrollAttributes(element) {
    const callbacks = element.dataset.scrollAttr.split(',').map(attributeGroup => {
        let [attribute, from, to, unit] = attributeGroup.trim().split(' ');
        unit ||= '%';
        from = from ? parseFloat(from) : 0;
        let delta = (to ? parseFloat(to) : 100) - from;
        return (t) => element.setAttribute(attribute, `${t * delta + from}${unit}`)
    });
    return (t) => callbacks.forEach(callback => callback(t));
}

// Setup every scroll sensitive tags 
document.querySelectorAll("[data-scroll-anchor][data-scroll-attr]").forEach((element) => {

    let anchorElement = document.getElementById(element.dataset.scrollAnchor),
        callbacks = parseScrollAttributes(element);
        
    onViewScroll(anchorElement, (ev) => callbacks(ev.detail));
    callbacks(getScrollFactor(anchorElement));
});