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

	_calculateYOffset: function(block, blockHeight, scale, parentTop, parentHeight, targetHeight) {
		// determine offset
		var offsetY = parentTop - block.parentNode.offsetTop + block.offsetTop;

		if (parentHeight < window.innerHeight || blockHeight * scale < parentHeight) {
			offsetY -= targetHeight / 2 - blockHeight * scale / 2;
		}

		if (parentTop > 0) {
			offsetY -= parentTop;
		}

		return -offsetY;
	},

	_transform: function(block, offsetX, offsetY, scale) {
		block.style.transform = 'translate(' + offsetX.toFixed(8) + '%, ' + offsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';
		block.style.webkitTransform = 'translate(' + offsetX.toFixed(8) + '%, ' + offsetY.toFixed(8) + '%) scale(' + scale.toFixed(8) + ')';
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

		// calculate scale
		var scale = targetHeight / blockHeight;

		if (blockWidth * scale > parentWidth) {
			scale = parentWidth / blockWidth;
		}

		// shift in current item
		var leftOffsetX = parentWidth / 2 - blockWidth * scale / 2 - block.offsetLeft;

		// transform item
		var percentageOffsetX = leftOffsetX / blockWidth * 100;
		var percentageOffsetY = zoomwall._calculateYOffset(block, blockHeight, scale, parentTop, parentHeight, targetHeight) / blockHeight * 100;

		zoomwall._transform(block, percentageOffsetX, percentageOffsetY, scale);

		// tranform items afterwards
		var next = block.nextElementSibling;
		var prevWidth = 0;
		var prevTop = block.offsetTop;
		var itemOffsetX = blockWidth * (scale - 1);

		while (next) {
			var height = parseInt(window.getComputedStyle(next).height, 10);
			prevWidth = parseInt(window.getComputedStyle(next).width, 10);

			if (next.offsetTop != prevTop) {
				itemOffsetX += parentWidth;
			}

			var percentageOffsetX = (leftOffsetX + itemOffsetX) / prevWidth * 100;
			var percentageOffsetY = zoomwall._calculateYOffset(next, height, scale, parentTop, parentHeight, targetHeight) / height * 100;

			zoomwall._transform(next, percentageOffsetX, percentageOffsetY, scale);

			itemOffsetX += prevWidth * (scale - 1);
			prevTop = next.offsetTop;

			next = next.nextElementSibling;
		}

		// transform items before
		var prev = block.previousElementSibling;
		prevWidth = 0;
		prevTop = block.offsetTop;
		itemOffsetX = 0;

		while (prev) {
			var height = parseInt(window.getComputedStyle(prev).height, 10);
			prevWidth = parseInt(window.getComputedStyle(prev).width, 10);

			if (prev.offsetTop != prevTop) {
				itemOffsetX -= parentWidth;
			}

			itemOffsetX -= prevWidth * (scale - 1);

			var percentageOffsetX = (leftOffsetX + itemOffsetX) / prevWidth * 100;
			var percentageOffsetY = zoomwall._calculateYOffset(prev, height, scale, parentTop, parentHeight, targetHeight) / height * 100;

			zoomwall._transform(prev, percentageOffsetX, percentageOffsetY, scale);
			
			prevTop = prev.offsetTop;

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