zoomwall.js
===========
zoomwall.js is a content-focused photo gallery using a horizontal masonry layout that scales up in lightbox mode.

Visit [ericleong.github.io/zoomwall.js](http://ericleong.github.io/zoomwall.js) for a demo.

install
-------
For those using [bower](http://bower.io/)
```bash
$ bower install zoomwall
```

usage
-----
First, add a reference to `zoomwall.js` and `zoomwall.css` in your HTML file, like this:
```HTML
<link rel="stylesheet" type="text/css" href="zoomwall.css" />
<script type="text/javascript" src="zoomwall.js"></script>
```
Then add the `zoomwall` class and run `zoomwall.create()` on the element that contains your images, after they have loaded.

For example, if this is the element that contains your images:
```HTML
<div id="gallery" class="zoomwall">
	<img src="./images/01.jpg" data-highres="./images/01_1280.jpg" />
	<img src="./images/02.jpg" data-highres="./images/02_1280.jpg" />
	<img src="./images/03.jpg" data-highres="./images/03_1280.jpg" />
</div>
```
add this code in a `<script>` tag:
```JavaScript
window.onload = function() {
	zoomwall.create(document.getElementById('gallery'));
};
```

Enable support for paging through photos by setting the second argument to `true`, like this: `zoomwall.create(<element>, true)`.

Include high resolution photos using the `data-highres` attribute of your `<img>` tags.
