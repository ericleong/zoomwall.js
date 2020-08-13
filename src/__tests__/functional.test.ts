import "expect-puppeteer";
import { ElementHandle } from "puppeteer";
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const pti = require("puppeteer-to-istanbul");

describe.each(["flat", "nested"])("interaction tests %s", (type) => {
  beforeAll(async () => {
    await Promise.all([page.coverage.startJSCoverage()]);

    await page.goto(`http://localhost:3000/?type=${type}`);
  });

  test("resize images on create", async () => {
    const fourthImg: ElementHandle<HTMLImageElement> = await expect(
      page
    ).toMatchElement("#four");
    expect(await fourthImg.evaluate((node) => node.style.width)).toBe("25%");
    const fifthImg: ElementHandle<HTMLImageElement> = await expect(
      page
    ).toMatchElement("#five");
    expect(await fifthImg.evaluate((node) => node.style.width)).toBe(
      "10.3093%"
    );
  });

  test(`click to open dataset lightbox`, async () => {
    const gallery = await expect(page).toMatchElement("#gallery");
    expect(
      Object.values(await gallery.evaluate((node) => node.classList))
    ).not.toContain("lightbox");

    const img: ElementHandle<HTMLImageElement> = await expect(
      page
    ).toMatchElement("#four");
    const imgSrc = await img.evaluate((node) => node.src);
    const imgHigh = (await img.evaluate(
      (node) => node.dataset.highres
    )) as string;

    await expect(page).toClick("#four");

    expect(
      Object.values(await gallery.evaluate((node) => node.classList))
    ).toContain("lightbox");
    expect(
      Object.values(await img.evaluate((node) => node.classList))
    ).toContain("active");
    expect(await img.evaluate((node) => node.style.transform)).toBe(
      "translate(-300%, 0%) scale(4)"
    );
    expect(await img.evaluate((node) => node.src)).toBe(imgHigh);
    expect(await img.evaluate((node) => node.dataset.lowres)).toBe(imgSrc);
  });

  test(`click to close dataset lightbox`, async () => {
    const gallery = await expect(page).toMatchElement("#gallery");
    expect(
      Object.values(await gallery.evaluate((node) => node.classList))
    ).toContain("lightbox");

    const img: ElementHandle<HTMLImageElement> = await expect(
      page
    ).toMatchElement("#four");
    const imgLow = await img.evaluate((node) => node.dataset.lowres);

    await expect(page).toClick("#four");

    expect(
      Object.values(await gallery.evaluate((node) => node.classList))
    ).not.toContain("lightbox");
    expect(
      Object.values(await img.evaluate((node) => node.classList))
    ).not.toContain("active");
    expect(await img.evaluate((node) => node.style.transform)).toBe(
      "translate(0px, 0px) scale(1)"
    );
    expect(await img.evaluate((node) => node.src)).toBe(imgLow);
  });

  test(`click to open srcset lightbox`, async () => {
    const gallery = await expect(page).toMatchElement("#gallery");
    expect(
      Object.values(await gallery.evaluate((node) => node.classList))
    ).not.toContain("lightbox");

    const img: ElementHandle<HTMLImageElement> = await expect(
      page
    ).toMatchElement("#ten");

    await expect(page).toClick("#ten");

    expect(
      Object.values(await gallery.evaluate((node) => node.classList))
    ).toContain("lightbox");
    expect(
      Object.values(await img.evaluate((node) => node.classList))
    ).toContain("active");
    expect(await img.evaluate((node) => node.style.transform)).toBe(
      "translate(-638.613%, -110.084%) scale(4.97479)"
    );
    expect(await img.evaluate((node) => node.sizes)).toBe("100vw");
    expect(await img.evaluate((node) => node.dataset.sizes)).toBe(
      "(max-width: 800px) 10vw, 853px"
    );
  });

  test(`click to close srcset lightbox`, async () => {
    const gallery = await expect(page).toMatchElement("#gallery");
    expect(
      Object.values(await gallery.evaluate((node) => node.classList))
    ).toContain("lightbox");

    const img: ElementHandle<HTMLImageElement> = await expect(
      page
    ).toMatchElement("#ten");

    await expect(page).toClick("#ten");

    expect(
      Object.values(await gallery.evaluate((node) => node.classList))
    ).not.toContain("lightbox");
    expect(
      Object.values(await img.evaluate((node) => node.classList))
    ).not.toContain("active");
    expect(await img.evaluate((node) => node.style.transform)).toBe(
      "translate(0px, 0px) scale(1)"
    );
    expect(await img.evaluate((node) => node.sizes)).toBe(
      "(max-width: 800px) 10vw, 853px"
    );
  });

  test("right arrow to advance to next image", async () => {
    const gallery = await expect(page).toMatchElement("#gallery");

    // open lightbox
    await expect(page).toClick("#four");
    expect(
      Object.values(await gallery.evaluate((node) => node.classList))
    ).toContain("lightbox");

    const fourthImg: ElementHandle<HTMLImageElement> = await expect(
      page
    ).toMatchElement("#four");
    const fifthImg: ElementHandle<HTMLImageElement> = await expect(
      page
    ).toMatchElement("#five");
    const fifthImgSrc = await fifthImg.evaluate((node) => node.src);
    const fifthImgHigh = await fifthImg.evaluate(
      (node) => node.dataset.highres
    );

    await page.keyboard.press("ArrowRight");

    expect(
      Object.values(await gallery.evaluate((node) => node.classList))
    ).toContain("lightbox");
    expect(
      Object.values(await fourthImg.evaluate((node) => node.classList))
    ).not.toContain("active");
    expect(
      Object.values(await fifthImg.evaluate((node) => node.classList))
    ).toContain("active");

    const fifthTransform = await fifthImg.evaluate(
      (node) => node.style.transform
    );
    const fifthTransformSplit = fifthTransform.split(" ");
    expect(fifthTransformSplit[0]).toBe("translate(243.333%,");
    // flat: -109.167, nested: -108.264 (close enough?)
    expect(parseFloat(fifthTransformSplit[1].slice(0, -2))).toBeCloseTo(
      -109.167,
      -1
    );
    expect(fifthTransformSplit[2]).toBe("scale(4.93333)");
    expect(await fifthImg.evaluate((node) => node.src)).toBe(fifthImgHigh);
    expect(await fifthImg.evaluate((node) => node.dataset.lowres)).toBe(
      fifthImgSrc
    );
  });

  test("left arrow to go to previous image", async () => {
    const gallery = await expect(page).toMatchElement("#gallery");

    const fourthImg: ElementHandle<HTMLImageElement> = await expect(
      page
    ).toMatchElement("#four");
    const fifthImg: ElementHandle<HTMLImageElement> = await expect(
      page
    ).toMatchElement("#five");
    const fourthImgSrc = await fourthImg.evaluate((node) => node.src);
    const fourthImgHigh = await fourthImg.evaluate(
      (node) => node.dataset.highres
    );

    await page.keyboard.press("ArrowLeft");

    expect(
      Object.values(await gallery.evaluate((node) => node.classList))
    ).toContain("lightbox");
    expect(
      Object.values(await fourthImg.evaluate((node) => node.classList))
    ).toContain("active");
    expect(
      Object.values(await fifthImg.evaluate((node) => node.classList))
    ).not.toContain("active");
    expect(await fourthImg.evaluate((node) => node.style.transform)).toBe(
      "translate(-300%, 0%) scale(4)"
    );
    expect(await fourthImg.evaluate((node) => node.src)).toBe(fourthImgHigh);
    expect(await fourthImg.evaluate((node) => node.dataset.lowres)).toBe(
      fourthImgSrc
    );
  });

  test("escape closes lightbox", async () => {
    const gallery = await expect(page).toMatchElement("#gallery");
    expect(
      Object.values(await gallery.evaluate((node) => node.classList))
    ).toContain("lightbox");

    const fourthImg: ElementHandle<HTMLImageElement> = await expect(
      page
    ).toMatchElement("#four");
    const fifthImg: ElementHandle<HTMLImageElement> = await expect(
      page
    ).toMatchElement("#five");

    await page.keyboard.press("Escape");

    expect(
      Object.values(await gallery.evaluate((node) => node.classList))
    ).not.toContain("lightbox");
    expect(
      Object.values(await fourthImg.evaluate((node) => node.classList))
    ).not.toContain("active");
    expect(
      Object.values(await fifthImg.evaluate((node) => node.classList))
    ).not.toContain("active");
    expect(await fifthImg.evaluate((node) => node.style.transform)).toBe(
      "translate(0px, 0px) scale(1)"
    );
    expect(await fourthImg.evaluate((node) => node.style.transform)).toBe(
      "translate(0px, 0px) scale(1)"
    );
    expect(await fourthImg.evaluate((node) => node.src)).toBe(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAACnAQMAAAACMtNXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAADUExURX9/f5DKGyMAAAAcSURBVBgZ7cExAQAAAMIg+6deCj9gAAAAAAA8BRWHAAFREbyXAAAAAElFTkSuQmCC"
    );
    expect(await fifthImg.evaluate((node) => node.src)).toBe(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKcAAAD6AQMAAAD+yMWGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAADUExURaGhoWkNFFsAAAAcSURBVBgZ7cExAQAAAMIg+6deCU9gAAAAAADcBRV8AAE4UWJ7AAAAAElFTkSuQmCC"
    );
  });

  afterAll(async () => {
    const [jsCoverage] = await Promise.all([page.coverage.stopJSCoverage()]);
    // skips the javascript in the html file
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await pti.write([...jsCoverage].slice(1), {
      includeHostname: false,
    });
  });
});
