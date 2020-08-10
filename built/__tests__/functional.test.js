var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'expect-puppeteer';
describe.each(['flat', 'nested'])('interaction tests %s', (type) => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield page.goto(`http://localhost:3000/?type=${type}`);
    }));
    test('resize images on create', () => __awaiter(void 0, void 0, void 0, function* () {
        const fourthImg = yield expect(page).toMatchElement('#four');
        expect(yield fourthImg.evaluate(node => node.style.width)).toBe('25%');
        const fifthImg = yield expect(page).toMatchElement('#five');
        expect(yield fifthImg.evaluate(node => node.style.width)).toBe('10.296%');
    }));
    test('click to open lightbox', () => __awaiter(void 0, void 0, void 0, function* () {
        const gallery = yield expect(page).toMatchElement('#gallery');
        expect(Object.values(yield gallery.evaluate(node => node.classList))).not.toContain('lightbox');
        const fourthImg = yield expect(page).toMatchElement('#four');
        const fourthImgSrc = yield fourthImg.evaluate(node => node.src);
        const fourthImgHigh = yield fourthImg.evaluate(node => node.dataset.highres);
        yield expect(page).toClick('#four');
        expect(Object.values(yield gallery.evaluate(node => node.classList))).toContain('lightbox');
        expect(Object.values(yield fourthImg.evaluate(node => node.classList))).toContain('active');
        expect(yield fourthImg.evaluate(node => node.style.transform)).toBe('translate(-300%, 0%) scale(4)');
        expect(yield fourthImg.evaluate(node => node.src)).toBe(fourthImgHigh);
        expect(yield fourthImg.evaluate(node => node.dataset.lowres)).toBe(fourthImgSrc);
    }));
    test('click to close lightbox', () => __awaiter(void 0, void 0, void 0, function* () {
        const gallery = yield expect(page).toMatchElement('#gallery');
        expect(Object.values(yield gallery.evaluate(node => node.classList))).toContain('lightbox');
        const fourthImg = yield expect(page).toMatchElement('#four');
        const fourthImgLow = yield fourthImg.evaluate(node => node.dataset.lowres);
        yield expect(page).toClick('#four');
        expect(Object.values(yield gallery.evaluate(node => node.classList))).not.toContain('lightbox');
        expect(Object.values(yield fourthImg.evaluate(node => node.classList))).not.toContain('active');
        expect(yield fourthImg.evaluate(node => node.style.transform)).toBe('translate(0px, 0px) scale(1)');
        expect(yield fourthImg.evaluate(node => node.src)).toBe(fourthImgLow);
    }));
    test('right arrow to advance to next image', () => __awaiter(void 0, void 0, void 0, function* () {
        const gallery = yield expect(page).toMatchElement('#gallery');
        // open lightbox
        yield expect(page).toClick('#four');
        expect(Object.values(yield gallery.evaluate(node => node.classList))).toContain('lightbox');
        const fourthImg = yield expect(page).toMatchElement('#four');
        const fifthImg = yield expect(page).toMatchElement('#five');
        const fifthImgSrc = yield fifthImg.evaluate(node => node.src);
        const fifthImgHigh = yield fifthImg.evaluate(node => node.dataset.highres);
        yield page.keyboard.press('ArrowRight');
        expect(Object.values(yield gallery.evaluate(node => node.classList))).toContain('lightbox');
        expect(Object.values(yield fourthImg.evaluate(node => node.classList))).not.toContain('active');
        expect(Object.values(yield fifthImg.evaluate(node => node.classList))).toContain('active');
        const fifthTransform = yield fifthImg.evaluate(node => node.style.transform);
        const fifthTransformSplit = fifthTransform.split(' ');
        expect(fifthTransformSplit[0]).toBe('translate(243.333%,');
        // flat: -109.167, nested: -108.264 (close enough?)
        expect(parseFloat(fifthTransformSplit[1].slice(0, -2))).toBeCloseTo(-109.167, -1);
        expect(fifthTransformSplit[2]).toBe('scale(4.93333)');
        expect(yield fifthImg.evaluate(node => node.src)).toBe(fifthImgHigh);
        expect(yield fifthImg.evaluate(node => node.dataset.lowres)).toBe(fifthImgSrc);
    }));
    test('escape closes lightbox', () => __awaiter(void 0, void 0, void 0, function* () {
        const gallery = yield expect(page).toMatchElement('#gallery');
        expect(Object.values(yield gallery.evaluate(node => node.classList))).toContain('lightbox');
        const fourthImg = yield expect(page).toMatchElement('#four');
        const fifthImg = yield expect(page).toMatchElement('#five');
        yield page.keyboard.press('Escape');
        expect(Object.values(yield gallery.evaluate(node => node.classList))).not.toContain('lightbox');
        expect(Object.values(yield fourthImg.evaluate(node => node.classList))).not.toContain('active');
        expect(Object.values(yield fifthImg.evaluate(node => node.classList))).not.toContain('active');
        expect(yield fifthImg.evaluate(node => node.style.transform)).toBe('translate(0px, 0px) scale(1)');
    }));
});
