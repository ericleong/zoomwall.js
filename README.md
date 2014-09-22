zoomwall.js
===========
zoomwall.js is a content-focused photo gallery using a horizontal masonry layout that scales up in lightbox mode.

Visit [ericleong.github.io/zoomwall.js](http://ericleong.github.io/zoomwall.js) for a demo.

usage
-----
Simply run `zoomwall.create()` on the element that contains your images.

```JavaScript
window.onload = function() {
	zoomwall.create(document.getElementById('zoomwall'));
};
```

Include high resolution photos using the `data-highres` attribute of your `<img>` tags.