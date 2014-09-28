zoomwall.js
===========
zoomwall.js is a content-focused photo gallery using a horizontal masonry layout that scales up in lightbox mode.

Visit [ericleong.github.io/zoomwall.js](http://ericleong.github.io/zoomwall.js) for a demo.

usage
-----
Simply add the `zoomwall` class and run `zoomwall.create()` on the element that contains your images, after they have loaded.

For example, if the element has the id `gallery`:
```JavaScript
window.onload = function() {
	zoomwall.create(document.getElementById('gallery'));
};
```

Enable support for paging through photos by setting the second argument to `true`, like this: `zoomwall.create(<element>, true)`.

Include high resolution photos using the `data-highres` attribute of your `<img>` tags.
