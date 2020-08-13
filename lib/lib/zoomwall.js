/*
zoomwall.js

The MIT License (MIT)

Copyright (c) 2014 Eric Leong

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/**
 * Create a gallery with the provided HTMLElement.
 *
 * @param blocks contains the images that belong to the gallery
 * @param enableKeys enables keyboard navigation
 */
export function create(blocks, enableKeys = false) {
    const imgs = blocks.querySelectorAll("img");
    resize([...imgs]);
    blocks.classList.remove("loading");
    // shrink blocks if an empty space is clicked
    blocks.addEventListener("click", function () {
        const imgs = blocks.getElementsByTagName("img");
        if (imgs.length > 0) {
            shrink(imgs[0]);
        }
    });
    // add click listeners to blocks
    imgs.forEach(function (img) {
        img.addEventListener("click", animate);
    });
    // add key down listener
    if (enableKeys) {
        keys(blocks);
    }
}
function findWall(elem) {
    // traverse dom to find gallery root node
    let parent = elem;
    while (parent.parentElement) {
        parent = parent.parentElement;
        if (parent instanceof HTMLElement &&
            parent.classList.contains("zoomwall")) {
            return parent;
        }
    }
    return null;
}
function keys(blocks) {
    const keyPager = function (e) {
        if (e.defaultPrevented) {
            return;
        }
        if (blocks.classList.contains("lightbox")) {
            switch (e.keyCode) {
                case 27: {
                    // escape
                    const imgs = blocks.getElementsByTagName("img");
                    if (imgs.length > 0) {
                        shrink(imgs[0]);
                        e.preventDefault();
                    }
                    break;
                }
                case 37: // left
                    page(blocks, false);
                    e.preventDefault();
                    break;
                case 39: // right
                    page(blocks, true);
                    e.preventDefault();
                    break;
            }
        }
    };
    document.addEventListener("keydown", keyPager);
    return keyPager;
}
function resizeRow(row, width) {
    if (row && row.length > 1) {
        row.forEach(function (img) {
            img.style.width = `${(parseInt(window.getComputedStyle(img).width, 10) / width) * 100}%`;
            img.style.height = "auto";
        });
    }
}
function calcRowWidth(row) {
    return row.reduce((width, img) => width + parseInt(window.getComputedStyle(img).width, 10), 0);
}
function resize(blocks) {
    blocks
        .reduce(function (rows, block) {
        var _a;
        const offsetTop = block.offsetTop;
        if (!rows.has(offsetTop)) {
            rows.set(offsetTop, []);
        }
        (_a = rows.get(offsetTop)) === null || _a === void 0 ? void 0 : _a.push(block);
        return rows;
    }, new Map())
        .forEach((row) => resizeRow(row, calcRowWidth(row)));
}
function reset(block) {
    block.style.transform = "translate(0, 0) scale(1)";
    block.classList.remove("active");
    // swap images
    if (block.dataset.lowres) {
        block.src = block.dataset.lowres;
    }
    if (block.dataset.sizes) {
        block.sizes = block.dataset.sizes;
    }
}
function shrink(block) {
    const blocks = findWall(block);
    if (blocks) {
        blocks.classList.remove("lightbox");
        // reset all blocks
        blocks.querySelectorAll("img").forEach(function (img) {
            reset(img);
        });
    }
}
function expand(block) {
    const blocks = findWall(block);
    if (blocks == null) {
        return;
    }
    block.classList.add("active");
    blocks.classList.add("lightbox");
    // parent dimensions
    const parentStyle = window.getComputedStyle(blocks);
    const parentWidth = parseInt(parentStyle.width, 10);
    const parentHeight = parseInt(parentStyle.height, 10);
    const parentTop = blocks.getBoundingClientRect().top;
    // block dimensions
    const blockStyle = window.getComputedStyle(block);
    const blockWidth = parseInt(blockStyle.width, 10);
    const blockHeight = parseInt(blockStyle.height, 10);
    // determine maximum height
    let targetHeight = window.innerHeight;
    if (parentHeight < window.innerHeight) {
        targetHeight = parentHeight;
    }
    else if (parentTop > 0) {
        targetHeight -= parentTop;
    }
    // swap images
    if (block.dataset.highres) {
        if (block.src != block.dataset.highres &&
            block.dataset.lowres === undefined) {
            block.dataset.lowres = block.src;
        }
        block.src = block.dataset.highres;
    }
    if (block.sizes) {
        // responsive images
        block.dataset.sizes = block.sizes;
        block.sizes = "100vw"; // image is now 100% of the viewport width
    }
    // determine what blocks are on this row
    const imgs = [...blocks.querySelectorAll("img")];
    const selectedRow = imgs.filter((img) => img.offsetTop == block.offsetTop);
    // calculate scale
    let scale = targetHeight / blockHeight;
    if (blockWidth * scale > parentWidth) {
        scale = parentWidth / blockWidth;
    }
    // determine offset
    let offsetY = parentTop - blocks.offsetTop + block.offsetTop;
    if (offsetY > 0) {
        if (parentHeight < window.innerHeight) {
            offsetY -= targetHeight / 2 - (blockHeight * scale) / 2;
        }
        if (parentTop > 0) {
            offsetY -= parentTop;
        }
    }
    const leftWidth = selectedRow
        .slice(0, selectedRow.indexOf(block))
        .reduce((offset, img) => offset + parseInt(window.getComputedStyle(img).width, 10) * scale, 0);
    const leftOffsetX = parentWidth / 2 - (blockWidth * scale) / 2 - leftWidth;
    const rows = imgs.reduce(function (rows, block) {
        var _a;
        // group rows
        const offsetTop = block.offsetTop;
        if (!rows.has(offsetTop)) {
            rows.set(offsetTop, []);
        }
        (_a = rows.get(offsetTop)) === null || _a === void 0 ? void 0 : _a.push(block);
        return rows;
    }, new Map());
    const selectedIndex = [...rows.keys()].indexOf(block.offsetTop);
    const rowHeights = [...rows.values()].map((r) => parseInt(window.getComputedStyle(r[0]).height, 10));
    rows.forEach((row, offsetTop, rows) => {
        const rowIndex = [...rows.keys()].indexOf(offsetTop);
        // compute the y offset based on the distance from this row to the selected row
        const rowOffsetY = Math.sign(rowIndex - selectedIndex) *
            (scale - 1) *
            rowHeights
                .slice(...[selectedIndex, rowIndex].sort())
                .reduce((offset, height) => offset + height, 0) -
            offsetY;
        row
            .map((img) => {
            return {
                img: img,
                width: parseInt(window.getComputedStyle(img).width, 10),
            };
        })
            .forEach((item, columnIndex, items) => {
            const offsetX = items
                .slice(0, columnIndex)
                .reduce((offset, elem) => offset + elem.width, 0) *
                (scale - 1);
            const percentageOffsetX = ((offsetX + leftOffsetX) / item.width) * 100;
            const percentageOffsetY = (rowOffsetY /
                parseInt(window.getComputedStyle(item.img).height, 10)) *
                100;
            item.img.style.transformOrigin = "0% 0%";
            item.img.style.transform =
                "translate(" +
                    percentageOffsetX.toFixed(8) +
                    "%, " +
                    percentageOffsetY.toFixed(8) +
                    "%) scale(" +
                    scale.toFixed(8) +
                    ")";
        });
    });
}
function animate(e) {
    if (!(e.target instanceof HTMLImageElement)) {
        return;
    }
    const block = e.target;
    const blocks = findWall(block);
    if (block.classList.contains("active")) {
        shrink(block);
    }
    else if (blocks instanceof HTMLElement) {
        [...blocks.getElementsByClassName("active")].forEach((block) => block.classList.remove("active"));
        expand(block);
    }
    e.stopPropagation();
}
function page(blocks, isNext = true) {
    const actives = blocks.querySelectorAll("img.active");
    if (actives && actives.length > 0) {
        const current = actives[0];
        let next;
        const wall = findWall(current);
        if (wall == null) {
            return;
        }
        const imgs = wall.querySelectorAll("img");
        const blockIndex = [...imgs].indexOf(current);
        if (isNext) {
            next = imgs[blockIndex + 1];
        }
        else {
            next = imgs[blockIndex - 1];
        }
        if (next) {
            current.classList.remove("active");
            // swap images
            if (current.dataset.lowres) {
                current.src = current.dataset.lowres;
            }
            if (current.dataset.sizes) {
                current.sizes = current.dataset.sizes;
            }
            expand(next);
        }
    }
}
