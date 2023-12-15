import { onView } from "./view.mjs";

export const GridEvent = new CustomEvent("grid");

/**
 * Count number of occurence of a char in a string
 * @param {String} string 
 * @param {String} searchString 
 * @returns {Number}
 */
function countOcc(string, searchChar) {
    let count = 0;
    for (let i = 0; i < string.length; i++)
        if (string.charAt(i) == searchChar)
            count++;
    return count;
}

/**
 * Get CSS grid -1 dimensions of element 
 * @param {Element} gridEl 
 * @returns {{x: Number, y: Number}}    Size of CSS grid
 */
function getGridSize(gridEl) {
    let gridCSS = getComputedStyle(gridEl);
    return {
        x: countOcc(gridCSS.gridTemplateColumns, ' '),
        y: countOcc(gridCSS.gridTemplateRows, ' ')
    }
}

/**
 * Scale the grid of an element
 * @param {Element} gridEl  An element with a CSS grid
 * @param {Number} x        X position of scaled cell
 * @param {Number} y        Y position of scaled cell
 * @param {Number} sizeX    Number of cells on x axis
 * @param {Number} sizeY    Number of cells on y axis
 * @param {Number} scaleX   X scale of the cell
 * @param {Number} scaleY   Y scale of the cell
 */
function scaleGrid(gridEl, x, y, sizeX, sizeY, scaleX = 2, scaleY = 2) {
    let unitX = `${1 - (scaleX - 1) / sizeX}fr `,
        unitY = `${1 - (scaleY - 1) / sizeX}fr `;
    gridEl.dispatchEvent(GridEvent);
    gridEl.style.gridTemplateColumns = `${unitX.repeat(x)} ${scaleX}fr ${unitX.repeat(sizeX - x)}`;
    gridEl.style.gridTemplateRows = `${unitY.repeat(y)} ${scaleY}fr ${unitY.repeat(sizeY - y)}`;
}

document.querySelectorAll("[gridable]").forEach(gridEl => {
    onView(gridEl, () => {
        let size = getGridSize(gridEl);
        scaleGrid(gridEl, Math.round(Math.random() * 2), Math.round(Math.random() * 2), size.x, size.y, 2, 2);
    });
});