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

export const zoomwall = {

  create: function (blocks: HTMLElement, enableKeys = false): void {
    const imgs = blocks.querySelectorAll('img');

    zoomwall.resize([...imgs]);

    blocks.classList.remove('loading');
    // shrink blocks if an empty space is clicked
    blocks.addEventListener('click', function () {
      const imgs = blocks.getElementsByTagName('img');
      if (imgs.length > 0) {
        zoomwall.shrink(imgs[0]);
      }
    });

    // add click listeners to blocks
    imgs.forEach(function(img) {
      img.addEventListener('click', zoomwall.animate);
    });

    // add key down listener
    if (enableKeys) {
      zoomwall.keys(blocks);
    }
  },

  findWall: function(elem: Element): HTMLElement | null { // traverse dom to find gallery root node
    let parent: Element | null = elem;

    while (parent.parentElement) {
      parent = parent.parentElement;

      if (parent instanceof HTMLElement && parent.classList.contains('zoomwall')) {
        return parent;
      }
    }

    return null;
  },

  keys: function (blocks: HTMLElement): (e: KeyboardEvent) => void {
    const keyPager = function (e: KeyboardEvent) {
      if (e.defaultPrevented) {
        return;
      }

      // either use the provided blocks, or query for the first lightboxed zoomwall
      if (!(blocks instanceof HTMLElement)) {
        for (const div of document.getElementsByClassName('zoomwall lightbox')) {
          if (div instanceof HTMLElement) {
            blocks = div;
          }
        }
      }

      if (!(blocks instanceof HTMLElement)) {
        return;
      }

      if (blocks && blocks.classList.contains('lightbox')) {
        switch (e.keyCode) {
        case 27: {// escape
          const imgs = blocks.getElementsByTagName('img');
          if (imgs.length > 0) {
            zoomwall.shrink(imgs[0]);
            e.preventDefault();
          }

          break;
        }
        case 37: // left
          zoomwall.page(blocks, false);
          e.preventDefault();

          break;

        case 39: // right
          zoomwall.page(blocks, true);
          e.preventDefault();

          break;
        }
      }
    };

    document.addEventListener('keydown', keyPager);

    return keyPager;
  },

  resizeRow: function (row: HTMLElement[], width: number): void {
    if (row && row.length > 1) {
      row.forEach(function(img) {
        img.style.width = `${parseInt(window.getComputedStyle(img).width, 10) / width * 100}%`;
        img.style.height = 'auto';
      });
    }
  },

  calcRowWidth: function (row: HTMLElement[]): number {
    return row.reduce((width, img) => width + parseInt(window.getComputedStyle(img).width, 10), 0);
  },

  resize: function (blocks: HTMLElement[]): void {
    blocks.reduce(function(rows, block) {
      const offsetTop = block.offsetTop;

      if (!rows.has(offsetTop)) {
        rows.set(offsetTop, []);
      }

      rows.get(offsetTop)?.push(block);

      return rows;
    }, new Map<number, HTMLElement[]>())
      .forEach(row => zoomwall.resizeRow(row, zoomwall.calcRowWidth(row)));
  },

  reset: function (block: HTMLElement): void {
    block.style.transform = 'translate(0, 0) scale(1)';
    block.classList.remove('active');
  },

  shrink: function (block: HTMLImageElement): void {
    const blocks = zoomwall.findWall(block);

    if (blocks) {
      blocks.classList.remove('lightbox');

      // reset all blocks
      blocks.querySelectorAll('img').forEach(function(img) {
        zoomwall.reset(img);
      });
    }

    // swap images
    if (block.dataset.lowres) {
      block.src = block.dataset.lowres;
    }
    if (block.dataset.sizes) {
      block.sizes = block.dataset.sizes;
    }
  },

  expand: function (block: HTMLImageElement): void {

    const blocks = zoomwall.findWall(block);

    if (blocks == null) {
      return;
    }

    block.classList.add('active');
    blocks.classList.add('lightbox');

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
    } else if (parentTop > 0) {
      targetHeight -= parentTop;
    }

    // swap images
    if (block.dataset.highres) {
      if (block.src != block.dataset.highres && block.dataset.lowres === undefined) {
        block.dataset.lowres = block.src;
      }
      block.src = block.dataset.highres;
    }
    if (block.sizes) { // responsive images
      block.dataset.sizes = block.sizes;
      block.sizes = '100vw'; // image is now 100% of the viewport width
    }

    // determine what blocks are on this row
    const imgs = [...blocks.querySelectorAll('img')];
    const selectedRow = imgs.filter(img => img.offsetTop == block.offsetTop);

    // calculate scale
    let scale = targetHeight / blockHeight;

    if (blockWidth * scale > parentWidth) {
      scale = parentWidth / blockWidth;
    }

    // determine offset
    let offsetY = parentTop - blocks.offsetTop + block.offsetTop;

    if (offsetY > 0) {
      if (parentHeight < window.innerHeight) {
        offsetY -= targetHeight / 2 - blockHeight * scale / 2;
      }

      if (parentTop > 0) {
        offsetY -= parentTop;
      }
    }

    const leftWidth = selectedRow.slice(0, selectedRow.indexOf(block)).reduce((offset, img) => offset + parseInt(window.getComputedStyle(img).width, 10) * scale, 0);
    const leftOffsetX = parentWidth / 2 - blockWidth * scale / 2 - leftWidth;

    const rows: Map<number, HTMLImageElement[]> = imgs.reduce(function(rows, block) {
      // group rows
      const offsetTop: number = block.offsetTop;

      if (!rows.has(offsetTop)) {
        rows.set(offsetTop, []);
      }

      rows.get(offsetTop)?.push(block);

      return rows;
    }, new Map<number, HTMLImageElement[]>());

    const selectedIndex = [...rows.keys()].indexOf(block.offsetTop);
    const rowHeights = [...rows.values()].map(r => parseInt(window.getComputedStyle(r[0]).height, 10));

    rows.forEach((row, offsetTop, rows) => {
      const rowIndex = [...rows.keys()].indexOf(offsetTop);
      // compute the y offset based on the distance from this row to the selected row
      const rowOffsetY = Math.sign(rowIndex - selectedIndex) * (scale - 1) * rowHeights.slice(...[selectedIndex, rowIndex].sort()).reduce((offset, height) => offset + height, 0) - offsetY;

      row.map((img) => {
        return {img: img, width: parseInt(window.getComputedStyle(img).width, 10)};
      })
        .forEach((item, columnIndex, items) => {
          const offsetX = items.slice(0, columnIndex).reduce((offset, elem) => offset + elem.width, 0) * (scale - 1);
          const percentageOffsetX = (offsetX + leftOffsetX) / item.width * 100;
          const percentageOffsetY = rowOffsetY / parseInt(window.getComputedStyle(item.img).height, 10) * 100;

          item.img.style.transformOrigin = '0% 0%';
          item.img.style.transform = 'translate(' + percentageOffsetX.toFixed(8) + '%, ' + percentageOffsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';
        });
    });
  },

  animate: function (e: MouseEvent): void {
    if (!(e.target instanceof HTMLImageElement)) {
      return;
    }
    const block: HTMLImageElement = e.target;

    const blocks = zoomwall.findWall(block);

    if (block.classList.contains('active')) {
      zoomwall.shrink(block);
    } else if (blocks instanceof HTMLElement) {
      [...blocks.getElementsByClassName('active')].forEach(block => block.classList.remove('active'));

      zoomwall.expand(block);
    }

    e.stopPropagation();
  },

  page: function (blocks: HTMLElement, isNext = true): void {
    const actives = blocks.querySelectorAll<HTMLImageElement>('img.active');

    if (actives && actives.length > 0) {

      const current = actives[0];
      let next: HTMLImageElement;

      const wall = zoomwall.findWall(current);

      if (wall == null) {
        return;
      }

      const imgs = wall.querySelectorAll('img');
      const blockIndex = [...imgs].indexOf(current);

      if (isNext) {
        next = imgs[blockIndex + 1];
      } else {
        next = imgs[blockIndex - 1];
      }

      if (next) {
        current.classList.remove('active');
        // swap images
        if (current.dataset.lowres) {
          current.src = current.dataset.lowres;
        }
        if (current.dataset.sizes) {
          current.sizes = current.dataset.sizes;
        }

        zoomwall.expand(next);
      }
    }
  }
};