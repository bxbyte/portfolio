import "./elements/page-section.mjs";
import "./graph/elements.mjs";
import "./svg-mesh/elements.mjs";
const ACTIVE_EV = new CustomEvent("active");
window.addEventListener("hashchange", (ev) => {
    const [oldHREF] = ev.oldURL.match(/#.*$/ig), [newHREF] = ev.newURL.match(/#.*$/ig);
    document.querySelectorAll(`[href='${oldHREF}']`).forEach(link => link.classList.remove("active"));
    document.querySelectorAll(`[href='${newHREF}']`).forEach(link => {
        link.classList.add("active");
        link.dispatchEvent(ACTIVE_EV);
    });
});
const [href] = location.href.match(/#.*$/ig);
document.querySelectorAll(`[href='${href}']`).forEach(link => link.classList.add("active"));
