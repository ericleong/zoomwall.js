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

var zoomwall = {

	create: function(blocks, enableKeys) {
		zoomwall.resize(blocks.children);

		blocks.classList.remove('loading');
		// shrink blocks if an empty space is clicked
		blocks.addEventListener('click', function() {
			if (this.children && this.children.length > 0) {
				zoomwall.shrink(this.children[0]);
			}
		});

		// add click listeners to blocks
		for (var i = 0; i < blocks.children.length; i++) {
			blocks.children[i].addEventListener('click', zoomwall.animate);
		}

		// add key down listener
		if (enableKeys) {
			var keyPager = function(e) {
				if (e.defaultPrevented) {
					return;
				}

				switch (e.keyCode) {
					case 27:
						if (blocks.children && blocks.children.length > 0) {
							zoomwall.shrink(blocks.children[0]);
						}
						e.preventDefault();

						break;

					case 37:
						zoomwall.page(blocks, false);
						e.preventDefault();

						break;

					case 39:
						zoomwall.page(blocks, true);
						e.preventDefault();

						break;
				}
			}

			document.addEventListener('keydown', keyPager);
		}
	},

	resizeRow: function(row, width) {
		if (row && row.length > 1) {
			for (var i in row) {
				row[i].style.width = (parseInt(window.getComputedStyle(row[i]).width, 10) / width * 100) + '%';
				row[i].style.height = 'auto';
			}
		}
	},

	calcRowWidth: function(row) {
		var width = 0;

		for (var i in row) {
			width += parseInt(window.getComputedStyle(row[i]).width, 10);
		}

		return width;
	},

	resize: function(blocks) {
		var row = [];
		var top = -1;

		for (var c = 0; c < blocks.length; c++) {
			var block = blocks[c];

			if (block) {
				if (top == -1) {
					top = block.offsetTop;
					
				} else if (block.offsetTop != top) {
					zoomwall.resizeRow(row, zoomwall.calcRowWidth(row));

					row = [];
					top = block.offsetTop;
				}

				row.push(block);
			}
		}

		zoomwall.resizeRow(row, zoomwall.calcRowWidth(row));
	},

	reset: function(block) {
		block.style.transform = 'translate(0, 0) scale(1)';
		block.style.webkitTransform = 'translate(0, 0) scale(1)';
		block.classList.remove('active');
	},

	shrink: function(block) {
		block.parentNode.classList.remove('lightbox');

		// reset all blocks
		zoomwall.reset(block);

		var prev = block.previousElementSibling;
		while (prev) {
			zoomwall.reset(prev);
			prev = prev.previousElementSibling;
		}

		var next = block.nextElementSibling;
		while (next) {
			zoomwall.reset(next);
			next = next.nextElementSibling;
		}

		// swap images
		if (block.dataset.lowres) {
			block.src = block.dataset.lowres;
		}
	},

	expand: function(block) {

		block.classList.add('active');
		block.parentNode.classList.add('lightbox');

		// parent dimensions
		var parentStyle = window.getComputedStyle(block.parentNode);

		var parentWidth = parseInt(parentStyle.width, 10);
		var parentHeight = parseInt(parentStyle.height, 10);

		var parentTop = block.parentNode.getBoundingClientRect().top;

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
		
		// determine what blocks are on this row
		var row = [];
		row.push(block);

		var next = block.nextElementSibling;

		while (next && next.offsetTop == block.offsetTop) {
			row.push(next);

			next = next.nextElementSibling;
		}

		var prev = block.previousElementSibling;

		while (prev && prev.offsetTop == block.offsetTop) {
			row.unshift(prev);

			prev = prev.previousElementSibling;
		}

		// calculate scale
		var scale = targetHeight / blockHeight;

		if (blockWidth * scale > parentWidth) {
			scale = parentWidth / blockWidth;
		}

		// determine offset
		var offsetY = parentTop - block.parentNode.offsetTop + block.offsetTop;

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

		for (var i = row.length - 1; i >= 0 && row[i] != block; i--) {
			rightOffsetX += parseInt(window.getComputedStyle(row[i]).width, 10) * scale;
		}

		rightOffsetX = parentWidth / 2 - blockWidth * scale / 2 - rightOffsetX;

		// transform current row
		var itemOffset = 0; // offset due to scaling of previous items
		var prevWidth = 0;
		
		for (var i = 0; i < row.length; i++) {
			itemOffset += (prevWidth * scale - prevWidth);
			prevWidth = parseInt(window.getComputedStyle(row[i]).width, 10);

			var percentageOffsetX = (itemOffset + leftOffsetX) / prevWidth * 100;
			var percentageOffsetY = -offsetY / parseInt(window.getComputedStyle(row[i]).height, 10) * 100;

			row[i].style.transformOrigin = '0% 0%';
			row[i].style.webkitTransformOrigin = '0% 0%';
			row[i].style.transform = 'translate(' + percentageOffsetX.toFixed(8) + '%, ' + percentageOffsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';
			row[i].style.webkitTransform = 'translate(' + percentageOffsetX.toFixed(8) + '%, ' + percentageOffsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';
		}

		// transform items after
		var nextOffsetY = blockHeight * (scale - 1) - offsetY;
		var prevHeight;
		itemOffset = 0; // offset due to scaling of previous items
		prevWidth = 0;

		var next = row[row.length - 1].nextElementSibling;
		var nextRowTop = -1;

		while (next) {
			var curTop = next.offsetTop;

			if (curTop == nextRowTop) {
				itemOffset += prevWidth * scale - prevWidth;
			} else {

				if (nextRowTop != -1) {
					itemOffset = 0;
					nextOffsetY += prevHeight * (scale - 1);
				}

				nextRowTop = curTop;
			}

			prevWidth = parseInt(window.getComputedStyle(next).width, 10);
			prevHeight = parseInt(window.getComputedStyle(next).height, 10);

			var percentageOffsetX = (itemOffset + leftOffsetX) / prevWidth * 100;
			var percentageOffsetY = nextOffsetY / prevHeight * 100;

			next.style.transformOrigin = '0% 0%';
			next.style.webkitTransformOrigin = '0% 0%';
			next.style.transform = 'translate(' + percentageOffsetX.toFixed(8) + '%, ' + percentageOffsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';
			next.style.webkitTransform = 'translate(' + percentageOffsetX.toFixed(8) + '%, ' + percentageOffsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';

			next = next.nextElementSibling;
		}

		// transform items before
		var prevOffsetY = -offsetY;
		itemOffset = 0; // offset due to scaling of previous items
		prevWidth = 0;

		var prev = row[0].previousElementSibling;
		var prevRowTop = -1;

		while (prev) {
			var curTop = prev.offsetTop;

			if (curTop == prevRowTop) {
				itemOffset -= prevWidth * scale - prevWidth;
			} else {
				itemOffset = 0;
				prevOffsetY -= parseInt(window.getComputedStyle(prev).height, 10) * (scale - 1);
				prevRowTop = curTop;
			}

			prevWidth = parseInt(window.getComputedStyle(prev).width, 10);

			var percentageOffsetX = (itemOffset - rightOffsetX) / prevWidth * 100;
			var percentageOffsetY = prevOffsetY / parseInt(window.getComputedStyle(prev).height, 10) * 100;

			prev.style.transformOrigin = '100% 0%';
			prev.style.webkitTransformOrigin = '100% 0%';
			prev.style.transform = 'translate(' + percentageOffsetX.toFixed(8) + '%, ' + percentageOffsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';
			prev.style.webkitTransform = 'translate(' + percentageOffsetX.toFixed(8) + '%, ' + percentageOffsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';

			prev = prev.previousElementSibling;
		}
	},

	animate: function(e) {
		if (this.classList.contains('active')) {
			zoomwall.shrink(this);
		} else {
			var actives = this.parentNode.getElementsByClassName('active');

			for (var i = 0; i < actives.length; i++) {
				actives[i].classList.remove('active');
			}

			zoomwall.expand(this);
		}

		e.stopPropagation();
	},

	page: function(blocks, isNext) {
		var actives = blocks.getElementsByClassName('active');

		if (actives && actives.length > 0) {

			var current = actives[0];
			var next;

			if (isNext) {
				next = current.nextElementSibling;
			} else {
				next = current.previousElementSibling;
			}

			if (next) {
				current.classList.remove('active');
				// swap images
				if (current.dataset.lowres) {
					current.src = current.dataset.lowres;
				}

				zoomwall.expand(next);
			}
		}
	}
};