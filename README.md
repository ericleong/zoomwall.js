zoomwall.js
===========
zoomwall.js is a content-focused photo gallery using a horizontal masonry layout that scales up in lightbox mode.

Visit [ericleong.github.io/zoomwall.js](http://ericleong.github.io/zoomwall.js) for a demo.

usage
-----
Simply add the `zoomwall` class and run `zoomwall.create()` on the element that contains your images.

For example, if the element has the id `gallery`:
```JavaScript
window.onload = function() {
	zoomwall.create(document.getElementById('gallery'));
};
```

Include high resolution photos using the `data-highres` attribute of your `<img>` tags.
