import { zoomwall } from './zoomwall.js';
import { jest } from '@jest/globals';

test('expand rows to fill width of parent', () => {
  document.body.innerHTML = 
  '<div id="gallery" class="zoomwall">' + 
  '  <img src="01_lowres.jpg" data-highres="01_highres.jpg" width="250" height="167" style="width: 250px"/>' +
  '  <img src="02_lowres.jpg" data-highres="02_highres.jpg" width="250" height="167" style="width: 250px"/>' +
  '</div>';

  zoomwall.create(document.getElementById('gallery'));

  const gallery = document.getElementById('gallery');
  expect(gallery.children[0].style.width).toBe('50%');
  expect(gallery.children[0].style.height).toBe('auto');
  expect(gallery.children[1].style.width).toBe('50%');
  expect(gallery.children[1].style.height).toBe('auto');
});

test('clicking image transitions to lightbox', () => {

  document.body.innerHTML = 
  '<div id="gallery" class="zoomwall" style="width: 1024px, height: 768px">' + 
  '  <img src="01_lowres.jpg" data-highres="01_highres.jpg" width="250" height="167" style="width: 250px, height: 167px"/>' +
  '  <img src="02_lowres.jpg" data-highres="02_highres.jpg" width="250" height="167" style="width: 250px, height: 167px"/>' +
  '</div>';

  zoomwall.create(document.getElementById('gallery'));

  const gallery = document.getElementById('gallery');
  const selected = gallery.children[1];
  selected.click();

  expect(gallery.classList).toContain('lightbox');
  expect(selected.classList).toContain('active');
  expect(selected.src).toBe(`${window.location}02_highres.jpg`);
  expect(selected.dataset.lowres).toBe(`${window.location}02_lowres.jpg`);
});

test('clicking lightbox closes lightbox', () => {

  document.body.innerHTML = 
  '<div id="gallery" class="zoomwall" style="width: 1024px, height: 768px">' + 
  '  <img src="01_lowres.jpg" data-highres="01_highres.jpg" width="250" height="167" style="width: 250px, height: 167px"/>' +
  '  <img src="02_lowres.jpg" data-highres="02_highres.jpg" width="250" height="167" style="width: 250px, height: 167px"/>' +
  '</div>';

  zoomwall.create(document.getElementById('gallery'));

  const gallery = document.getElementById('gallery');
  const selected = gallery.children[1];
  selected.click(); // open
  selected.click(); // close

  expect(gallery.classList).not.toContain('lightbox');
  expect(selected.classList).not.toContain('active');
  expect(selected.src).toBe(`${window.location}02_lowres.jpg`);
});

test('calculate row width', () => {

  document.body.innerHTML = 
  '<div id="gallery" class="zoomwall" style="width: 1024px, height: 768px">' + 
  '  <img src="01_lowres.jpg" data-highres="01_highres.jpg" width="250" height="167" style="width: 250px, height: 167px"/>' +
  '  <img src="02_lowres.jpg" data-highres="02_highres.jpg" width="250" height="167" style="width: 250px, height: 167px"/>' +
  '</div>';

  Object.defineProperty(window, 'getComputedStyle', {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
      width: '250px',
      height: '167px'
    })),
  });

  const row = [...document.getElementById('gallery').children];
  const width = zoomwall.calcRowWidth(row);

  expect(width).toBe(500);
});