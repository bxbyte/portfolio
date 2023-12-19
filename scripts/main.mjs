import "./elements/asciiText.mjs";
import "./elements/animText.mjs";
import "./elements/maskDiv.mjs";

import { viewObserver } from "./view.mjs";
import { onViewScroll, getScrollFactor } from "./scroll.mjs";

// Setup
// -----

// Every sections are view sensitive
document.querySelectorAll("main > section").forEach(element => viewObserver.observe(element));

// Setup every scroll sensitive tags 
// With data-scroll formated as below:
// (#[anchorId]?) [attributeGroup1], [attributeGroup2], ...
// An attribute group is formated like:
// [attribute] [startRange | 0] [endRange | 100] [unit | %]
// If no anchor id is provided, the default fall to the element itself
document.querySelectorAll("[data-scroll]").forEach((element) => {
    let { anchorId, attributes } = element.dataset.scroll.match(/(?:#(?<anchorId>\S+)\s)?(?<attributes>.*)/).groups;
    let anchorElement = anchorId ? document.getElementById(anchorId) : element;

    let updateScrollCallbacks = attributes.split(',').map(attributeGroup => {
        let [attribute, start, end, unit] = attributeGroup.trim().split(' ');
        unit ||= '%';
        start = start ? parseFloat(start) : 0;
        let delta = (end ? parseFloat(end) : 100) - start;
        return (t) => element.setAttribute(attribute, `${t * delta + start}${unit}`);
    }),
    updateScroll = (t) => updateScrollCallbacks.forEach(callback => callback(t));

    onViewScroll(anchorElement, (ev) => updateScroll(ev.detail));
    updateScroll(getScrollFactor(anchorElement));
});