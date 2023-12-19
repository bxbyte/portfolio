import { onView } from "./view.mjs";

const scrollEventType = "scrollViewport",
    watchedScrollElements = new Set(), // Elements whose scroll factor is watched
    scrollInViewportElements = new Set(); // Those whose are in viewport

/**
 * Get a normalized value of the scroll relative position factor on element.
 * @param {Element} element 
 * @returns {Number}
 */
export function getScrollFactor(element) {
    return (window.innerHeight - element.getBoundingClientRect().top) / window.innerHeight; // "Normalize" the scroll factor
}
    
/**
 * Callback with percentage of scroll on element
 * @param {Element} element  Watched element
 * @param {(ev: CustomEvent | { detail: Number }) => void} onViewScrollCallback  Callback on scroll factor change
 */
export function onViewScroll(element, onViewScrollCallback) {
    element.addEventListener(scrollEventType, onViewScrollCallback);

    if (watchedScrollElements.has(element)) // Avoid double watching the same elements
        return;
    
    watchedScrollElements.add(element);
    onView(
        element,
        () => scrollInViewportElements.add(element),
        () => scrollInViewportElements.delete(element)
    );
}

// Update on scroll
window.addEventListener("scroll", () => {
    scrollInViewportElements.forEach(async (element) => element.dispatchEvent(
        new CustomEvent(scrollEventType, { detail: getScrollFactor(element)})
    ))
});