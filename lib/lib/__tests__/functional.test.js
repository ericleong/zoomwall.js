var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import "expect-puppeteer";
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const pti = require("puppeteer-to-istanbul");
const totalJsCoverage = [];
describe.each(["flat", "nested"])("interaction tests %s", (type) => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield page.coverage.startJSCoverage();
        yield page.goto(`http://localhost:3000/?type=${type}`);
    }));
    test("resize images on create", () => __awaiter(void 0, void 0, void 0, function* () {
        const fourthImg = yield expect(page).toMatchElement("#four");
        expect(yield fourthImg.evaluate((node) => node.style.width)).toBe("25%");
        const fifthImg = yield expect(page).toMatchElement("#five");
        expect(yield fifthImg.evaluate((node) => node.style.width)).toBe("10.3093%");
    }));
    test(`click to open dataset lightbox`, () => __awaiter(void 0, void 0, void 0, function* () {
        const gallery = yield expect(page).toMatchElement("#gallery");
        expect(Object.values(yield gallery.evaluate((node) => node.classList))).not.toContain("lightbox");
        const img = yield expect(page).toMatchElement("#four");
        const imgSrc = yield img.evaluate((node) => node.src);
        const imgHigh = (yield img.evaluate((node) => node.dataset.highres));
        yield expect(page).toClick("#four");
        expect(Object.values(yield gallery.evaluate((node) => node.classList))).toContain("lightbox");
        expect(Object.values(yield img.evaluate((node) => node.classList))).toContain("active");
        expect(yield img.evaluate((node) => node.style.transform)).toBe("translate(-300%, 0%) scale(4)");
        expect(yield img.evaluate((node) => node.src)).toBe(imgHigh);
        expect(yield img.evaluate((node) => node.dataset.lowres)).toBe(imgSrc);
    }));
    test(`click to close dataset lightbox`, () => __awaiter(void 0, void 0, void 0, function* () {
        const gallery = yield expect(page).toMatchElement("#gallery");
        expect(Object.values(yield gallery.evaluate((node) => node.classList))).toContain("lightbox");
        const img = yield expect(page).toMatchElement("#four");
        const imgLow = yield img.evaluate((node) => node.dataset.lowres);
        yield expect(page).toClick("#four");
        expect(Object.values(yield gallery.evaluate((node) => node.classList))).not.toContain("lightbox");
        expect(Object.values(yield img.evaluate((node) => node.classList))).not.toContain("active");
        expect(yield img.evaluate((node) => node.style.transform)).toBe("translate(0px, 0px) scale(1)");
        expect(yield img.evaluate((node) => node.src)).toBe(imgLow);
    }));
    test(`click to open srcset lightbox`, () => __awaiter(void 0, void 0, void 0, function* () {
        const gallery = yield expect(page).toMatchElement("#gallery");
        expect(Object.values(yield gallery.evaluate((node) => node.classList))).not.toContain("lightbox");
        const img = yield expect(page).toMatchElement("#ten");
        yield expect(page).toClick("#ten");
        expect(Object.values(yield gallery.evaluate((node) => node.classList))).toContain("lightbox");
        expect(Object.values(yield img.evaluate((node) => node.classList))).toContain("active");
        expect(yield img.evaluate((node) => node.style.transform)).toBe("translate(-638.613%, -110.084%) scale(4.97479)");
        expect(yield img.evaluate((node) => node.sizes)).toBe("100vw");
        expect(yield img.evaluate((node) => node.dataset.sizes)).toBe("(max-width: 800px) 10vw, 853px");
    }));
    test(`click to close srcset lightbox`, () => __awaiter(void 0, void 0, void 0, function* () {
        const gallery = yield expect(page).toMatchElement("#gallery");
        expect(Object.values(yield gallery.evaluate((node) => node.classList))).toContain("lightbox");
        const img = yield expect(page).toMatchElement("#ten");
        yield expect(page).toClick("#ten");
        expect(Object.values(yield gallery.evaluate((node) => node.classList))).not.toContain("lightbox");
        expect(Object.values(yield img.evaluate((node) => node.classList))).not.toContain("active");
        expect(yield img.evaluate((node) => node.style.transform)).toBe("translate(0px, 0px) scale(1)");
        expect(yield img.evaluate((node) => node.sizes)).toBe("(max-width: 800px) 10vw, 853px");
    }));
    test("right arrow to advance to next image", () => __awaiter(void 0, void 0, void 0, function* () {
        const gallery = yield expect(page).toMatchElement("#gallery");
        // open lightbox
        yield expect(page).toClick("#four");
        expect(Object.values(yield gallery.evaluate((node) => node.classList))).toContain("lightbox");
        const fourthImg = yield expect(page).toMatchElement("#four");
        const fifthImg = yield expect(page).toMatchElement("#five");
        const fifthImgSrc = yield fifthImg.evaluate((node) => node.src);
        const fifthImgHigh = yield fifthImg.evaluate((node) => node.dataset.highres);
        yield page.keyboard.press("ArrowRight");
        expect(Object.values(yield gallery.evaluate((node) => node.classList))).toContain("lightbox");
        expect(Object.values(yield fourthImg.evaluate((node) => node.classList))).not.toContain("active");
        expect(Object.values(yield fifthImg.evaluate((node) => node.classList))).toContain("active");
        const fifthTransform = yield fifthImg.evaluate((node) => node.style.transform);
        const fifthTransformSplit = fifthTransform.split(" ");
        expect(fifthTransformSplit[0]).toBe("translate(243.333%,");
        // flat: -109.167, nested: -108.264 (close enough?)
        expect(parseFloat(fifthTransformSplit[1].slice(0, -2))).toBeCloseTo(-109.167, -1);
        expect(fifthTransformSplit[2]).toBe("scale(4.93333)");
        expect(yield fifthImg.evaluate((node) => node.src)).toBe(fifthImgHigh);
        expect(yield fifthImg.evaluate((node) => node.dataset.lowres)).toBe(fifthImgSrc);
    }));
    test("left arrow to go to previous image", () => __awaiter(void 0, void 0, void 0, function* () {
        const gallery = yield expect(page).toMatchElement("#gallery");
        const fourthImg = yield expect(page).toMatchElement("#four");
        const fifthImg = yield expect(page).toMatchElement("#five");
        const fourthImgSrc = yield fourthImg.evaluate((node) => node.src);
        const fourthImgHigh = yield fourthImg.evaluate((node) => node.dataset.highres);
        yield page.keyboard.press("ArrowLeft");
        expect(Object.values(yield gallery.evaluate((node) => node.classList))).toContain("lightbox");
        expect(Object.values(yield fourthImg.evaluate((node) => node.classList))).toContain("active");
        expect(Object.values(yield fifthImg.evaluate((node) => node.classList))).not.toContain("active");
        expect(yield fourthImg.evaluate((node) => node.style.transform)).toBe("translate(-300%, 0%) scale(4)");
        expect(yield fourthImg.evaluate((node) => node.src)).toBe(fourthImgHigh);
        expect(yield fourthImg.evaluate((node) => node.dataset.lowres)).toBe(fourthImgSrc);
    }));
    test("escape closes lightbox", () => __awaiter(void 0, void 0, void 0, function* () {
        const gallery = yield expect(page).toMatchElement("#gallery");
        expect(Object.values(yield gallery.evaluate((node) => node.classList))).toContain("lightbox");
        const fourthImg = yield expect(page).toMatchElement("#four");
        const fifthImg = yield expect(page).toMatchElement("#five");
        yield page.keyboard.press("Escape");
        expect(Object.values(yield gallery.evaluate((node) => node.classList))).not.toContain("lightbox");
        expect(Object.values(yield fourthImg.evaluate((node) => node.classList))).not.toContain("active");
        expect(Object.values(yield fifthImg.evaluate((node) => node.classList))).not.toContain("active");
        expect(yield fifthImg.evaluate((node) => node.style.transform)).toBe("translate(0px, 0px) scale(1)");
        expect(yield fourthImg.evaluate((node) => node.style.transform)).toBe("translate(0px, 0px) scale(1)");
        expect(yield fourthImg.evaluate((node) => node.src)).toBe("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAACnAQMAAAACMtNXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAADUExURX9/f5DKGyMAAAAcSURBVBgZ7cExAQAAAMIg+6deCj9gAAAAAAA8BRWHAAFREbyXAAAAAElFTkSuQmCC");
        expect(yield fifthImg.evaluate((node) => node.src)).toBe("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKcAAAD6AQMAAAD+yMWGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAADUExURaGhoWkNFFsAAAAcSURBVBgZ7cExAQAAAMIg+6deCU9gAAAAAADcBRV8AAE4UWJ7AAAAAElFTkSuQmCC");
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const jsCoverage = yield page.coverage.stopJSCoverage();
        totalJsCoverage.push(...jsCoverage.slice(1));
    }));
});
describe("multiple galleries with keyboards", () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield page.coverage.startJSCoverage();
        yield page.goto(`http://localhost:3000/?type=multi`);
    }));
    test("right arrow to advance to next image in second gallery", () => __awaiter(void 0, void 0, void 0, function* () {
        const flat = yield expect(page).toMatchElement("#flat");
        const nested = yield expect(page).toMatchElement("#nested");
        // open second lightbox
        yield expect(page).toClick("#nested-four");
        expect(Object.values(yield nested.evaluate((node) => node.classList))).toContain("lightbox");
        const fourthImg = yield expect(page).toMatchElement("#nested-four");
        const fifthImg = yield expect(page).toMatchElement("#nested-five");
        const fifthImgSrc = yield fifthImg.evaluate((node) => node.src);
        const fifthImgHigh = yield fifthImg.evaluate((node) => node.dataset.highres);
        yield page.keyboard.press("ArrowRight");
        expect(Object.values(yield flat.evaluate((node) => node.classList))).not.toContain("lightbox");
        expect(Object.values(yield nested.evaluate((node) => node.classList))).toContain("lightbox");
        expect(Object.values(yield fourthImg.evaluate((node) => node.classList))).not.toContain("active");
        expect(Object.values(yield fifthImg.evaluate((node) => node.classList))).toContain("active");
        const fifthTransform = yield fifthImg.evaluate((node) => node.style.transform);
        const fifthTransformSplit = fifthTransform.split(" ");
        expect(fifthTransformSplit[0]).toBe("translate(337.819%,");
        // flat: -109.167, nested: -108.264 (close enough?)
        expect(parseFloat(fifthTransformSplit[1].slice(0, -2))).toBeCloseTo(-109.167, -1);
        expect(fifthTransformSplit[2]).toBe("scale(3.04362)");
        expect(yield fifthImg.evaluate((node) => node.src)).toBe(fifthImgHigh);
        expect(yield fifthImg.evaluate((node) => node.dataset.lowres)).toBe(fifthImgSrc);
    }));
    test("escape closes first lightbox", () => __awaiter(void 0, void 0, void 0, function* () {
        const flat = yield expect(page).toMatchElement("#flat");
        // open first lightbox
        yield expect(page).toClick("#flat-four");
        expect(Object.values(yield flat.evaluate((node) => node.classList))).toContain("lightbox");
        const nested = yield expect(page).toMatchElement("#nested");
        expect(Object.values(yield nested.evaluate((node) => node.classList))).toContain("lightbox");
        const firstFourthImg = yield expect(page).toMatchElement("#flat-four");
        const firstFifthImg = yield expect(page).toMatchElement("#flat-five");
        const secondFourthImg = yield expect(page).toMatchElement("#nested-four");
        const secondFifthImg = yield expect(page).toMatchElement("#nested-five");
        yield page.keyboard.press("Escape");
        expect(Object.values(yield flat.evaluate((node) => node.classList))).not.toContain("lightbox");
        expect(Object.values(yield nested.evaluate((node) => node.classList))).toContain("lightbox");
        expect(Object.values(yield firstFourthImg.evaluate((node) => node.classList))).not.toContain("active");
        expect(Object.values(yield firstFifthImg.evaluate((node) => node.classList))).not.toContain("active");
        expect(Object.values(yield secondFourthImg.evaluate((node) => node.classList))).not.toContain("active");
        expect(Object.values(yield secondFifthImg.evaluate((node) => node.classList))).toContain("active");
        expect(yield firstFifthImg.evaluate((node) => node.style.transform)).toBe("translate(0px, 0px) scale(1)");
        expect(yield firstFourthImg.evaluate((node) => node.style.transform)).toBe("translate(0px, 0px) scale(1)");
        expect(yield firstFourthImg.evaluate((node) => node.src)).toBe("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPoAAACnAQMAAAACMtNXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAADUExURX9/f5DKGyMAAAAcSURBVBgZ7cExAQAAAMIg+6deCj9gAAAAAAA8BRWHAAFREbyXAAAAAElFTkSuQmCC");
        expect(yield firstFifthImg.evaluate((node) => node.src)).toBe("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKcAAAD6AQMAAAD+yMWGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAADUExURaGhoWkNFFsAAAAcSURBVBgZ7cExAQAAAMIg+6deCU9gAAAAAADcBRV8AAE4UWJ7AAAAAElFTkSuQmCC");
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const jsCoverage = yield page.coverage.stopJSCoverage();
        totalJsCoverage.push(...jsCoverage.slice(1));
    }));
});
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // skips the javascript in the html file
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    yield pti.write(totalJsCoverage, {
        includeHostname: false,
    });
}));
