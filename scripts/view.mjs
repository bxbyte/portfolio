const ViewClassName = "viewed";

export const viewEvent = new CustomEvent("inViewport"),
    hideEvent = new CustomEvent("outViewport"),
    viewObserver = new IntersectionObserver((entries) => 
        entries.forEach(entry => {
            if (entry.isIntersecting){
                entry.target.classList.add(ViewClassName);
                entry.target.dispatchEvent(viewEvent);
            }
            else {
                entry.target.classList.remove(ViewClassName);
                entry.target.dispatchEvent(hideEvent);
            }
        })
    );

/**
 * If element is in viewport
 * @param {Element} element
 * @returns {boolean}
 */
export function isViewed(element) {
    return element.classList.contains(ViewClassName);
}

/**
 * Callback if an element is in viewport
 * @param {Element} element  Watched element
 * @param {() => void} onViewCallback  Callback when the element is in viewport
 * @param {(() => void)?} onHideCallback  Callback when the element is out of viewport
 */
export function onView(element, onViewCallback, onHideCallback) {
    element.addEventListener(viewEvent.type, onViewCallback);
    if (onHideCallback) element.addEventListener(hideEvent.type, onHideCallback);
    viewObserver.observe(element);
}