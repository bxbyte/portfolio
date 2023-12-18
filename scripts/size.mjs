const sizeEventType = "sized",
    sizeObserver = new ResizeObserver((entries) =>
        entries.forEach(entry => {
            entry.target.dispatchEvent(new CustomEvent(sizeEventType, { detail: entry }))
        })
    );

/**
 * Callback when the window resize
 * @param {Element} element  Watched element
 * @param {() => void} onResizeCallback  Callback on resize
 */
export function onResize(element, onResizeCallback) {
    element.addEventListener(sizeEventType, onResizeCallback);
    sizeObserver.observe(element);
}