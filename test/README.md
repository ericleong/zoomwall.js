# zoomwall.js

zoomwall.js is a content-focused photo gallery using a horizontal masonry layout that scales up in lightbox mode.

Visit [ericleong.github.io/zoomwall.js](http://ericleong.github.io/zoomwall.js) for a demo.

![Node.js CI](https://github.com/ericleong/zoomwall.js/workflows/Node.js%20CI/badge.svg?branch=master)
![Node.js Package](https://github.com/ericleong/zoomwall.js/workflows/Node.js%20Package/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/ericleong/zoomwall.js/badge.svg?branch=master)](https://coveralls.io/github/ericleong/zoomwall.js?branch=master)

## install

For those using [npm](https://www.npmjs.com/)

```bash
$ npm install zoomwall.js
```

## usage

### html

First, add a reference to `zoomwall.css` in your HTML file, like this:

```html
<link rel="stylesheet" type="text/css" href="zoomwall.css" />
```

Add the `zoomwall` class to the container element.

#### responsive images

To have the browser determine when to load a high resolution image, use [responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

```html
<div id="gallery" class="zoomwall">
  <img
    srcset="01_lowres.jpg 200w, 01_highres.jpg 800w"
    sizes="(max-width: 1200px) 200px, 800px"
    src="01_lowres.jpg"
  />
  <img
    srcset="02_lowres.jpg 200w, 02_highres.jpg 800w"
    sizes="(max-width: 1200px) 200px, 800px"
    src="02_lowres.jpg"
  />
</div>
```

#### high resolution image

Include high resolution photos using the `data-highres` attribute of each `<img>` tag.

```html
<div id="gallery" class="zoomwall">
  <img src="01_lowres.jpg" data-highres="01_highres.jpg" />
  <img src="02_lowres.jpg" data-highres="02_highres.jpg" />
</div>
```

### javascript

See [documentation](http://ericleong.github.io/zoomwall.js/docs). Remember to import the module.

```javascript
import * as zoomwall from "zoomwall.js";
```

Run `zoomwall.create()` on the container element (`#gallery` in this example), after they have loaded.

```javascript
window.onload = function () {
  zoomwall.create(document.getElementById("gallery"));
};
```

Enable support for paging through photos with the left and right arrow keys by setting the second argument to `true`, like this: `zoomwall.create(<element>, true)`.

If there are multiple galleries, call `zoomwall.keys()` after loading the last gallery.

```javascript
zoomwall.create(document.getElementById("first-gallery"));
zoomwall.create(document.getElementById("second-gallery"));
zoomwall.keys();
```
