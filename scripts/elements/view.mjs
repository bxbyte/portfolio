const ViewClassName = "viewed",
    viewEvent = new CustomEvent("viewed"),
    hideEvent = new CustomEvent("hide"),
    resizeElCallback = new Map(),
    viewer = new IntersectionObserver((entries) => {
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
    });

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
 * @param {Element} element             Watched element
 * @param {Function} onViewCallback     Callback when the element is in viewport
 * @param {Function?} onHideCallback    Callback when the element is out of viewport
 */
export function onView(element, onViewCallback, onHideCallback) {
    element.addEventListener(viewEvent.type, onViewCallback);
    if (onHideCallback) element.addEventListener(hideEvent.type, onHideCallback);
    viewer.observe(element);
}

/**
 * Callback when the window resize if the element is in viewport (optimized)
 * @param {Element} element     Watched element
 * @param {Function} callback   Callback on resize
 */
export function onResizeView(element, callback) {
    resizeElCallback.set(element, callback);
    callback();
    // element.addEventListener(viewEvent.type, () => callback(), { once: true });
    viewer.observe(element);
}

window.addEventListener("resize", () =>{
    resizeElCallback.forEach((callback, element) => {
        if (isViewed(element))
            callback();
    })
});

document.querySelectorAll("main > section").forEach(element => viewer.observe(element));