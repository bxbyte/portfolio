function openWindow(el) {
    console.log(el)
    let elBox = el.getBoundingClientRect(),
        bufferEl = document.createElement("div");
    el.parentElement.insertBefore(bufferEl, el);
    bufferEl.style.width = `${elBox.width}px`;
    bufferEl.style.height = `${elBox.height}px`;
    el.classList.add(".open");
    el.style.top = `${elBox.top}px`;
    el.style.left = `${elBox.left}px`;
    el.style.width = `${elBox.width}px`;
    el.style.height = `${elBox.height}px`;
    setTimeout(() => el.removeAttribute("style"), 0)
    return () => {
        bufferEl.remove();
        el.classList.remove(".open");
    }
}

// let el = document.querySelector("#windows > div:nth-child(2)"),
//     close = openWindow(el);

