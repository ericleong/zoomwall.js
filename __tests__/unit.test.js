import { zoomwall } from '../zoomwall.js';
import { jest } from '@jest/globals';

describe.each([
  `<div id="gallery" class="zoomwall" style="width: 1024px, height: 768px">
  <img src="01_lowres.jpg" data-highres="01_highres.jpg" width="250" height="167" style="width: 250px; height: 167px"/>
  <img src="02_lowres.jpg" data-highres="02_highres.jpg" width="250" height="167" style="width: 250px; height: 167px"/>
  <img src="03_lowres.jpg" data-highres="03_highres.jpg" width="250" height="167" style="width: 250px; height: 167px"/>
  <img src="04_lowres.jpg" data-highres="04_highres.jpg" width="250" height="167" style="width: 250px; height: 167px"/>
</div>`,
  `<div id="gallery" class="zoomwall" style="width: 1024px, height: 768px">
  <div>
    <img src="01_lowres.jpg" data-highres="01_highres.jpg" width="250" height="167" style="width: 250px; height: 167px"/>
    <img src="02_lowres.jpg" data-highres="02_highres.jpg" width="250" height="167" style="width: 250px; height: 167px"/>
  </div>
  <div>
    <img src="03_lowres.jpg" data-highres="03_highres.jpg" width="250" height="167" style="width: 250px; height: 167px"/>
    <img src="04_lowres.jpg" data-highres="04_highres.jpg" width="250" height="167" style="width: 250px; height: 167px"/>
  </div>
</div>`
])('unit tests for setup and computation', (html) => {
  beforeEach(() => {
    document.body.innerHTML = html;
  });

  test('expand rows to fill width of parent', () => {
    zoomwall.create(document.getElementById('gallery'));
  
    const imgs = [...document.querySelectorAll('#gallery img')];
    expect(imgs[0].style.width).toBe('25%');
    expect(imgs[0].style.height).toBe('auto');
    expect(imgs[1].style.width).toBe('25%');
    expect(imgs[1].style.height).toBe('auto');
  });

  test('clicking image transitions to lightbox', () => {
    zoomwall.create(document.getElementById('gallery'));
  
    const gallery = document.getElementById('gallery');
    const imgs = [...document.querySelectorAll('#gallery img')];
    const selected = imgs[1];
    selected.click();
  
    expect(gallery.classList).toContain('lightbox');
    expect(selected.classList).toContain('active');
    expect(selected.src).toBe(`${window.location}02_highres.jpg`);
    expect(selected.dataset.lowres).toBe(`${window.location}02_lowres.jpg`);
  });
  
  test('clicking lightbox closes lightbox', () => {
    zoomwall.create(document.getElementById('gallery'));
  
    const gallery = document.getElementById('gallery');
    const imgs = [...document.querySelectorAll('#gallery img')];
    const selected = imgs[1];
    selected.click(); // open
    selected.click(); // close
  
    expect(gallery.classList).not.toContain('lightbox');
    expect(selected.classList).not.toContain('active');
    expect(selected.src).toBe(`${window.location}02_lowres.jpg`);
  });

  test('calculate row width', () => {
    Object.defineProperty(window, 'getComputedStyle', {
      writable: true,
      value: jest.fn().mockImplementation(() => ({
        width: '250px',
        height: '167px'
      })),
    });
  
    const row = [...document.querySelectorAll('#gallery img')];
    const width = zoomwall.calcRowWidth(row);
  
    expect(width).toBe(1000);
  });
});