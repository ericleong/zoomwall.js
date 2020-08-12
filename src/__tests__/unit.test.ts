import * as zoomwall from "../zoomwall";

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
</div>`,
])("unit tests for setup and computation", (html) => {
  beforeEach(() => {
    document.body.innerHTML = html;
  });

  test("expand rows to fill width of parent", () => {
    const gallery = document.getElementById("gallery");
    expect(gallery).toBeTruthy();

    if (gallery == null) {
      return;
    }

    zoomwall.create(gallery);
    const imgs = [
      ...document.querySelectorAll<HTMLImageElement>("#gallery img"),
    ];

    expect(imgs[0].style.width).toBe("25%");
    expect(imgs[0].style.height).toBe("auto");
    expect(imgs[1].style.width).toBe("25%");
    expect(imgs[1].style.height).toBe("auto");
  });

  test("clicking image transitions to lightbox", () => {
    const gallery = document.getElementById("gallery");
    expect(gallery).toBeTruthy();

    if (gallery == null) {
      return;
    }

    zoomwall.create(gallery);
    const imgs = [
      ...document.querySelectorAll<HTMLImageElement>("#gallery img"),
    ];
    const selected = imgs[1];
    selected.click();

    expect(gallery?.classList).toContain("lightbox");
    expect(selected.classList).toContain("active");
    expect(selected.src).toBe(`${window.location.href}02_highres.jpg`);
    expect(selected.dataset.lowres).toBe(
      `${window.location.href}02_lowres.jpg`
    );
  });

  test("clicking lightbox closes lightbox", () => {
    const gallery = document.getElementById("gallery");
    expect(gallery).toBeTruthy();

    if (gallery == null) {
      return;
    }

    zoomwall.create(gallery);
    const imgs = [
      ...document.querySelectorAll<HTMLImageElement>("#gallery img"),
    ];
    const selected = imgs[1];
    selected.click(); // open
    selected.click(); // close

    expect(gallery?.classList).not.toContain("lightbox");
    expect(selected.classList).not.toContain("active");

    expect(selected.src).toBe(`${window.location.href}02_lowres.jpg`);
  });
});

describe("missing class", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="gallery" style="width: 1024px, height: 768px">
    <img src="01_lowres.jpg" data-highres="01_highres.jpg" width="250" height="167" style="width: 250px; height: 167px"/>
    <img src="02_lowres.jpg" data-highres="02_highres.jpg" width="250" height="167" style="width: 250px; height: 167px"/>
    <img src="03_lowres.jpg" data-highres="03_highres.jpg" width="250" height="167" style="width: 250px; height: 167px"/>
    <img src="04_lowres.jpg" data-highres="04_highres.jpg" width="250" height="167" style="width: 250px; height: 167px"/>
  </div>`;
  });

  test("clicking image does nothing", () => {
    const gallery = document.getElementById("gallery");
    expect(gallery).toBeTruthy();

    if (gallery == null) {
      return;
    }

    zoomwall.create(gallery);
    const imgs = [
      ...document.querySelectorAll<HTMLImageElement>("#gallery img"),
    ];
    const selected = imgs[1];
    selected.click();

    expect(gallery.classList).not.toContain("lightbox");
    expect(selected.classList).not.toContain("active");
    expect(selected.src).toBe(`${window.location.href}02_lowres.jpg`);
  });
});
