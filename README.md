zoomwall.js
===========
zoomwall.js is a content-focused photo gallery using a horizontal masonry layout that scales up in lightbox mode.

Visit [ericleong.github.io/zoomwall.js](http://ericleong.github.io/zoomwall.js) for a demo.

[![CircleCI](https://circleci.com/gh/ericleong/zoomwall.js/tree/master.svg?style=svg)](https://circleci.com/gh/ericleong/zoomwall.js/tree/master)

install
-------
For those using [bower](http://bower.io/)
```bash
$ bower install zoomwall
```

For those using [npm](https://www.npmjs.com/)
```bash
$ npm install zoomwall.js
```

usage
-----

### html

First, add a reference to `zoomwall.js` and `zoomwall.css` in your HTML file, like this:
```html
<link rel="stylesheet" type="text/css" href="zoomwall.css" />
<script type="text/javascript" src="zoomwall.js"></script>
```

Add the `zoomwall` class to the container element. Include high resolution photos using the `data-highres` attribute of each `<img>` tag.

```html
<div id="gallery" class="zoomwall">
    <img src="./images/01_lowres.jpg" data-highres="./images/01_highres.jpg" />
    <img src="./images/02_lowres.jpg" data-highres="./images/02_highres.jpg" />
</div>
```

### javascript

Run `zoomwall.create()` on the container element (`#gallery` in this example), after they have loaded.

```javascript
window.onload = function() {
    zoomwall.create(document.getElementById('gallery'));
};
```

Enable support for paging through photos with the left and right arrow keys by setting the second argument to `true`, like this: `zoomwall.create(<element>, true)`.

If there are multiple galleries, call `zoomwall.keys()` after loading the last gallery.

```javascript
zoomwall.create(document.getElementById('first-gallery'));
zoomwall.create(document.getElementById('second-gallery'));
zoomwall.keys();
```
