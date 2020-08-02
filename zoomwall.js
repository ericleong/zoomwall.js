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

export var zoomwall = {

  create: function (blocks, enableKeys) {
    const imgs = blocks.querySelectorAll('img');

    zoomwall.resize(imgs);

    blocks.classList.remove('loading');
    // shrink blocks if an empty space is clicked
    blocks.addEventListener('click', function () {
      if (this.children && this.children.length > 0) {
        zoomwall.shrink(this.children[0]);
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

  findWall: function(elem) { // traverse dom to find gallery root node
    var parent;

    do {
      parent = elem.parentElement;

      if (parent.classList.contains('zoomwall')) {
        return parent;
      }
    } while (parent);

    return null;
  },

  keys: function (blocks) {
    var keyPager = function (e) {
      if (e.defaultPrevented) {
        return;
      }

      // either use the provided blocks, or query for the first lightboxed zoomwall
      var elem = blocks || document.getElementsByClassName('zoomwall lightbox')[0];

      if (elem) {
        switch (e.keyCode) {
        case 27: // escape
          if (elem.children && elem.children.length > 0) {
            zoomwall.shrink(elem.children[0]);
          }
          e.preventDefault();

          break;

        case 37: // left
          zoomwall.page(elem, false);
          e.preventDefault();

          break;

        case 39: // right
          zoomwall.page(elem, true);
          e.preventDefault();

          break;
        }
      }
    };

    document.addEventListener('keydown', keyPager);

    return keyPager;
  },

  resizeRow: function (row, width) {
    if (row && row.length > 1) {
      row.forEach(function(img) {
        img.style.width = (parseInt(window.getComputedStyle(img).width, 10) / width * 100) + '%';
        img.style.height = 'auto';
      });
    }
  },

  calcRowWidth: function (row) {
    return row.reduce((width, img) => width + parseInt(window.getComputedStyle(img).width, 10), 0);
  },

  resize: function (blocks) {
    [...blocks].reduce(function(rows, block) {
      let offsetTop = block.offsetTop;

      if (!rows.has(offsetTop)) {
        rows.set(offsetTop, [])
      }

      rows.get(offsetTop).push(block);

      return rows;
    }, new Map())
    .forEach(row => zoomwall.resizeRow(row, zoomwall.calcRowWidth(row)));
  },

  reset: function (block) {
    block.style.transform = 'translate(0, 0) scale(1)';
    block.style.webkitTransform = 'translate(0, 0) scale(1)';
    block.classList.remove('active');
  },

  shrink: function (block) {
    const blocks = zoomwall.findWall(block);

    if (blocks) {
      blocks.classList.remove('lightbox');
    }

    // reset all blocks
    blocks.querySelectorAll('img').forEach(function(img) {
      zoomwall.reset(img);
    });

    // swap images
    if (block.dataset.lowres) {
      block.src = block.dataset.lowres;
    }
    if (block.dataset.sizes) {
      block.sizes = block.dataset.sizes;
    }
  },

  expand: function (block) {

    const blocks = zoomwall.findWall(block);

    block.classList.add('active');
    blocks.classList.add('lightbox');

    // parent dimensions
    var parentStyle = window.getComputedStyle(blocks);

    var parentWidth = parseInt(parentStyle.width, 10);
    var parentHeight = parseInt(parentStyle.height, 10);

    var parentTop = blocks.getBoundingClientRect().top;

    // block dimensions
    var blockStyle = window.getComputedStyle(block);

    var blockWidth = parseInt(blockStyle.width, 10);
    var blockHeight = parseInt(blockStyle.height, 10);

    // determine maximum height
    var targetHeight = window.innerHeight;

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
    const imgs = blocks.querySelectorAll('img');
    const imgsArray = [...imgs];
    const blockIndex = imgsArray.indexOf(block);

    var row = imgsArray.filter(img => img.offsetTop == block.offsetTop);
    const numBlocksAfterCurrentInRow = row.length - row.indexOf(block) - 1;

    // calculate scale
    var scale = targetHeight / blockHeight;

    if (blockWidth * scale > parentWidth) {
      scale = parentWidth / blockWidth;
    }

    // determine offset
    var offsetY = parentTop - blocks.offsetTop + block.offsetTop;

    if (offsetY > 0) {
      if (parentHeight < window.innerHeight) {
        offsetY -= targetHeight / 2 - blockHeight * scale / 2;
      }

      if (parentTop > 0) {
        offsetY -= parentTop;
      }
    }

    var leftOffsetX = 0;  // shift in current row

    for (var i = 0; i < row.length && row[i] != block; i++) {
      leftOffsetX += parseInt(window.getComputedStyle(row[i]).width, 10) * scale;
    }

    leftOffsetX = parentWidth / 2 - blockWidth * scale / 2 - leftOffsetX;

    var rightOffsetX = 0;  // shift in current row

    for (var j = row.length - 1; j >= 0 && row[j] != block; j--) {
      rightOffsetX += parseInt(window.getComputedStyle(row[j]).width, 10) * scale;
    }

    rightOffsetX = parentWidth / 2 - blockWidth * scale / 2 - rightOffsetX;

    var percentageOffsetX;
    var percentageOffsetY;

    // transform current row
    var itemOffset = 0; // offset due to scaling of previous items
    var prevWidth = 0;

    for (var k = 0; k < row.length; k++) {
      itemOffset += (prevWidth * scale - prevWidth);
      prevWidth = parseInt(window.getComputedStyle(row[k]).width, 10);

      percentageOffsetX = (itemOffset + leftOffsetX) / prevWidth * 100;
      percentageOffsetY = -offsetY / parseInt(window.getComputedStyle(row[k]).height, 10) * 100;

      row[k].style.transformOrigin = '0% 0%';
      row[k].style.webkitTransformOrigin = '0% 0%';
      row[k].style.transform = 'translate(' + percentageOffsetX.toFixed(8) + '%, ' + percentageOffsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';
      row[k].style.webkitTransform = 'translate(' + percentageOffsetX.toFixed(8) + '%, ' + percentageOffsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';
    }

    // transform items after
    var curTop;
    var nextOffsetY = blockHeight * (scale - 1) - offsetY;
    var prevHeight;
    itemOffset = 0; // offset due to scaling of previous items
    prevWidth = 0;

    var nextRowTop = -1;

    for (let nextItemIndex = blockIndex + numBlocksAfterCurrentInRow + 1, nextItem = imgs[nextItemIndex]; nextItem; nextItem = imgs[++nextItemIndex]) {
      curTop = nextItem.offsetTop;

      if (curTop == nextRowTop) {
        itemOffset += prevWidth * scale - prevWidth;
      } else {

        if (nextRowTop != -1) {
          itemOffset = 0;
          nextOffsetY += prevHeight * (scale - 1);
        }

        nextRowTop = curTop;
      }

      prevWidth = parseInt(window.getComputedStyle(nextItem).width, 10);
      prevHeight = parseInt(window.getComputedStyle(nextItem).height, 10);

      percentageOffsetX = (itemOffset + leftOffsetX) / prevWidth * 100;
      percentageOffsetY = nextOffsetY / prevHeight * 100;

      nextItem.style.transformOrigin = '0% 0%';
      nextItem.style.webkitTransformOrigin = '0% 0%';
      nextItem.style.transform = 'translate(' + percentageOffsetX.toFixed(8) + '%, ' + percentageOffsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';
      nextItem.style.webkitTransform = 'translate(' + percentageOffsetX.toFixed(8) + '%, ' + percentageOffsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';
    }

    // transform items before
    var prevOffsetY = -offsetY;
    itemOffset = 0; // offset due to scaling of previous items
    prevWidth = 0;

    var prevRowTop = -1;

    for (let prevItemIndex = blockIndex - (row.length - numBlocksAfterCurrentInRow - 1) - 1, prevItem = imgs[prevItemIndex]; prevItem; prevItem = imgs[--prevItemIndex]) {
      curTop = prevItem.offsetTop;

      if (curTop == prevRowTop) {
        itemOffset -= prevWidth * scale - prevWidth;
      } else {
        itemOffset = 0;
        prevOffsetY -= parseInt(window.getComputedStyle(prevItem).height, 10) * (scale - 1);
        prevRowTop = curTop;
      }

      prevWidth = parseInt(window.getComputedStyle(prevItem).width, 10);

      percentageOffsetX = (itemOffset - rightOffsetX) / prevWidth * 100;
      percentageOffsetY = prevOffsetY / parseInt(window.getComputedStyle(prevItem).height, 10) * 100;

      prevItem.style.transformOrigin = '100% 0%';
      prevItem.style.webkitTransformOrigin = '100% 0%';
      prevItem.style.transform = 'translate(' + percentageOffsetX.toFixed(8) + '%, ' + percentageOffsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';
      prevItem.style.webkitTransform = 'translate(' + percentageOffsetX.toFixed(8) + '%, ' + percentageOffsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';
    }
  },

  animate: function (e) {
    const blocks = zoomwall.findWall(e.target);

    if (this.classList.contains('active')) {
      zoomwall.shrink(this);
    } else {
      [...blocks.getElementsByClassName('active')].forEach(block => block.classList.remove('active'));

      zoomwall.expand(this);
    }

    e.stopPropagation();
  },

  page: function (blocks, isNext) {
    var actives = blocks.getElementsByClassName('active');

    if (actives && actives.length > 0) {

      var current = actives[0];
      var next;

      const wall = zoomwall.findWall(current);
      const imgs = wall.querySelectorAll('img');
      const blockIndex = [...imgs].indexOf(current)

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