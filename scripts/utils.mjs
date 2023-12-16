/**
 * Get computed CSS duration of an element
 * @param {Element} element     Target element
 * @param {String} prop         Name of propriety transition / animation (default)
 * @returns {Number}
 */
export function getCSSDuration(element, prop = "transition") {
    return parseFloat(getComputedStyle(element)[`${prop}Duration`]) * 1e3;
}