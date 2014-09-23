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

	create: function(blocks) {
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
	},

	resizeRow: function(row, width) {
		if (row && row.length > 1) {
			for (var i in row) {
				row[i].style.width = (row[i].getBoundingClientRect().width / width * 100) + '%';
				row[i].style.height = 'auto';
			}
		}
	},

	calcRowWidth: function(row) {
		var width = 0;

		for (var i in row) {
			width += row[i].getBoundingClientRect().width;
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
					top = block.getBoundingClientRect().top;
					
				} else if (block.getBoundingClientRect().top != top) {
					zoomwall.resizeRow(row, zoomwall.calcRowWidth(row));

					row = [];
					top = block.getBoundingClientRect().top;
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

		var parentRect = block.parentNode.getBoundingClientRect();
		var blockRect = block.getBoundingClientRect();
		var offsetY = blockRect.top;

		if (parentRect.top > 0) {
			offsetY -= parentRect.top;
		}

		// swap images
		if (block.dataset.highres) {
			block.dataset.lowres = block.src;
			block.src = block.dataset.highres;
		}
		
		// determine what blocks are on this row
		var row = [];
		row.push(block);

		var next = block.nextElementSibling;

		while (next && next.getBoundingClientRect().top == blockRect.top) {
			row.push(next);

			next = next.nextElementSibling;
		}

		var prev = block.previousElementSibling;

		while (prev && prev.getBoundingClientRect().top == blockRect.top) {
			row.unshift(prev);

			prev = prev.previousElementSibling;
		}

		// expand row and shift row below
		var scale = Math.min(window.innerHeight, parentRect.height) / blockRect.height;

		if (blockRect.width * scale > parentRect.width) {
			scale = parentRect.width / blockRect.width;
		}

		var leftOffsetX = 0;  // shift in current row
		
		for (var i = 0; i < row.length && row[i] != block; i++) {
			leftOffsetX += row[i].getBoundingClientRect().width * scale;
		}

		leftOffsetX = parentRect.width / 2 - blockRect.width * scale / 2 - leftOffsetX;

		var rightOffsetX = 0;  // shift in current row

		for (var i = row.length - 1; i >= 0 && row[i] != block; i--) {
			rightOffsetX += row[i].getBoundingClientRect().width * scale;
		}

		rightOffsetX = parentRect.width / 2 - blockRect.width * scale / 2 - rightOffsetX;

		// determine Y offset
		var itemOffset = 0; // offset due to scaling of previous items
		var prevWidth = 0;

		// transform current row
		for (var i = 0; i < row.length; i++) {
			itemOffset += (prevWidth * scale - prevWidth);
			prevWidth = row[i].getBoundingClientRect().width;

			var percentageOffsetX = (itemOffset + leftOffsetX) / prevWidth * 100;
			var percentageOffsetY = -offsetY / row[i].getBoundingClientRect().height * 100;

			row[i].style.transformOrigin = '0% 0%';
			row[i].style.webkitTransformOrigin = '0% 0%';
			row[i].style.transform = 'translate(' + percentageOffsetX.toFixed(8) + '%, ' + percentageOffsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';
			row[i].style.webkitTransform = 'translate(' + percentageOffsetX.toFixed(8) + '%, ' + percentageOffsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';
		}

		// transform items after
		var nextOffsetY = blockRect.height * (scale - 1) - offsetY;
		var prevHeight;
		itemOffset = 0; // offset due to scaling of previous items
		prevWidth = 0;

		var next = row[row.length - 1].nextElementSibling;
		var nextRowTop = -1;

		while (next) {
			var curTop = next.getBoundingClientRect().top;

			if (curTop == nextRowTop) {
				itemOffset += prevWidth * scale - prevWidth;
			} else {

				if (nextRowTop != -1) {
					itemOffset = 0;
					nextOffsetY += prevHeight * (scale - 1);
				}

				nextRowTop = curTop;
			}

			prevWidth = next.getBoundingClientRect().width;
			prevHeight = next.getBoundingClientRect().height;

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
			var curTop = prev.getBoundingClientRect().top;

			if (curTop == prevRowTop) {
				itemOffset -= prevWidth * scale - prevWidth;
			} else {
				itemOffset = 0;
				prevOffsetY -= prev.getBoundingClientRect().height * (scale - 1);
				prevRowTop = curTop;
			}

			prevWidth = prev.getBoundingClientRect().width;

			var percentageOffsetX = (itemOffset - rightOffsetX) / prevWidth * 100;
			var percentageOffsetY = prevOffsetY / prev.getBoundingClientRect().height * 100;

			prev.style.transformOrigin = '100% 0%';
			prev.style.webkitTransformOrigin = '100% 0%';
			prev.style.transform = 'translate(' + percentageOffsetX.toFixed(8) + '%, ' + percentageOffsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';
			prev.style.webkitTransform = 'translate(' + percentageOffsetX.toFixed(8) + '%, ' + percentageOffsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';

			prev = prev.previousElementSibling;
		}
	},

	animate: function(e) {
		if (this.parentNode.classList.contains('lightbox')) {
			zoomwall.shrink(this);
		} else {
			zoomwall.expand(this);
		}

		e.stopPropagation();
	}
};