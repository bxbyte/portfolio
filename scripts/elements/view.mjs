const ViewClassName = "viewed",
    viewEvent = new CustomEvent("viewed"),
    hideEvent = new CustomEvent("hided"),
    sizeEventType = "sized",
    sizeObserver = new ResizeObserver((entries) =>
        entries.forEach(entry =>
            entry.target.dispatchEvent(new CustomEvent(sizeEventType, { detail: entry }))
        )
    ),
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
 * @param {Element} element             Watched element
 * @param {() => void} onViewCallback     Callback when the element is in viewport
 * @param {(() => void)?} onHideCallback    Callback when the element is out of viewport
 */
export function onView(element, onViewCallback, onHideCallback) {
    element.addEventListener(viewEvent.type, onViewCallback);
    if (onHideCallback) element.addEventListener(hideEvent.type, onHideCallback);
    viewObserver.observe(element);
}

/**
 * Callback when the window resize if the element is in viewport (optimized)
 * @param {Element} element     Watched element
 * @param {() => void} callback   Callback on resize
 */
export function onResizeView(element, callback) {
    element.addEventListener(sizeEventType, callback);
    onView(element, () => sizeObserver.observe(element), () => sizeObserver.unobserve(element));
}

document.querySelectorAll("main > section").forEach(element => viewObserver.observe(element));