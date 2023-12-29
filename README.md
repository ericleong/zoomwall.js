# zoomwall.js [![GitHub release (latest by date)](https://img.shields.io/github/v/release/ericleong/zoomwall.js)](https://github.com/ericleong/zoomwall.js/releases) [![npm](https://img.shields.io/npm/dm/zoomwall.js)](https://www.npmjs.com/package/zoomwall.js) [![Coverage Status](https://coveralls.io/repos/github/ericleong/zoomwall.js/badge.svg?branch=master)](https://coveralls.io/github/ericleong/zoomwall.js?branch=master) [![Node.js CI](https://github.com/ericleong/zoomwall.js/workflows/Node.js%20CI/badge.svg?branch=master)](https://github.com/ericleong/zoomwall.js/actions?query=workflow%3A%22Node.js+CI%22)

zoomwall.js is a content-focused photo gallery using a horizontal masonry layout that scales up in lightbox mode.

Visit [ericleong.github.io/zoomwall.js](http://ericleong.github.io/zoomwall.js) for a demo.

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

### Lazy loading and backend url
By adding a `data-src` attribute to the gallery container its possible to fetch a json with urls to more images when the user has scrolled to the bottom of the page.

```javascript
<div id="zoomwall" class="zoomwall" data-src="/demo/data.json">
<!-- you can still add images here that will be displayed when page loads -->
  <img src="01_lowres.jpg" data-highres="01_highres.jpg" />
  <img src="02_lowres.jpg" data-highres="02_highres.jpg" />
</div>
```

Every time the user scrolls to the bottom again, a parameter "?page=<pagenumber>" is appended to the url. 
This enables for unlimited scrolling if you have many images. But it does require you to implement or modify the backend api to work with this format.

#### With srcsets and sizes
The srcset and the sizes are optional and must be correct html since their values are copied directly and will fail unless correct html syntax. Here is an example of how a working json response with an initial image and two srcset images and their respective sizes looks like:
```json
[
    {
        "url":"https://ericleong.me/zoomwall.js/images/01_250.jpg",
        "srcset":"https://ericleong.me/zoomwall.js/images/01_250.jpg 250w, https://ericleong.me/zoomwall.js/images/01_1280.jpg 1280w",
        "sizes":"(max-width: 1280px) 250px, 1280px"
    },{
        "url":"https://ericleong.me/zoomwall.js/images/01_250.jpg",
        "srcset":"https://ericleong.me/zoomwall.js/images/01_250.jpg 250w, https://ericleong.me/zoomwall.js/images/01_1280.jpg 1280w",
        "sizes":"(max-width: 1280px) 250px, 1280px"
    },
]
```