import 'expect-puppeteer';

beforeAll(async () => {
  await page.goto('http://localhost:3000');
});

test('resize images on create', async () => {
  const fourthImg = await expect(page).toMatchElement('#gallery > img:nth-child(4)');
  expect(await fourthImg.evaluate(node => node.style.width)).toBe('25%');
  const fifthImg = await expect(page).toMatchElement('#gallery > img:nth-child(5)');
  expect(await fifthImg.evaluate(node => node.style.width)).toBe('10.296%');
});

test('click to open lightbox', async () => {
  const gallery = await expect(page).toMatchElement('#gallery');
  expect(Object.values(await gallery.evaluate(node => node.classList))).not.toContain('lightbox');

  const fourthImg = await expect(page).toMatchElement('#gallery > img:nth-child(4)');
  const fourthImgSrc = await fourthImg.evaluate(node => node.src);
  const fourthImgHigh = await fourthImg.evaluate(node => node.dataset.highres);

  await expect(page).toClick('#gallery > img:nth-child(4)');

  expect(Object.values(await gallery.evaluate(node => node.classList))).toContain('lightbox');
  expect(Object.values(await fourthImg.evaluate(node => node.classList))).toContain('active');
  expect(await fourthImg.evaluate(node => node.style.transform)).toBe('translate(-300%, 0%) scale(4)');
  expect(await fourthImg.evaluate(node => node.src)).toBe(fourthImgHigh);
  expect(await fourthImg.evaluate(node => node.dataset.lowres)).toBe(fourthImgSrc);
});

test('click to close lightbox', async () => {
  const gallery = await expect(page).toMatchElement('#gallery');
  expect(Object.values(await gallery.evaluate(node => node.classList))).toContain('lightbox');

  const fourthImg = await expect(page).toMatchElement('#gallery > img:nth-child(4)');
  const fourthImgLow = await fourthImg.evaluate(node => node.dataset.lowres);

  await expect(page).toClick('#gallery > img:nth-child(4)');

  expect(Object.values(await gallery.evaluate(node => node.classList))).not.toContain('lightbox');
  expect(Object.values(await fourthImg.evaluate(node => node.classList))).not.toContain('active');
  expect(await fourthImg.evaluate(node => node.style.transform)).toBe('translate(0px, 0px) scale(1)');
  expect(await fourthImg.evaluate(node => node.src)).toBe(fourthImgLow);
});

test('right arrow to advance to next image', async () => {
  const gallery = await expect(page).toMatchElement('#gallery');

  // open lightbox
  await expect(page).toClick('#gallery > img:nth-child(4)');
  expect(Object.values(await gallery.evaluate(node => node.classList))).toContain('lightbox');

  const fourthImg = await expect(page).toMatchElement('#gallery > img:nth-child(4)');
  const fifthImg = await expect(page).toMatchElement('#gallery > img:nth-child(5)');
  const fifthImgSrc = await fifthImg.evaluate(node => node.src);
  const fifthImgHigh = await fifthImg.evaluate(node => node.dataset.highres);

  await page.keyboard.press('ArrowRight');

  expect(Object.values(await gallery.evaluate(node => node.classList))).toContain('lightbox');
  expect(Object.values(await fourthImg.evaluate(node => node.classList))).not.toContain('active');
  expect(Object.values(await fifthImg.evaluate(node => node.classList))).toContain('active');
  expect(await fifthImg.evaluate(node => node.style.transform)).toBe('translate(243.333%, -109.167%) scale(4.93333)');
  expect(await fifthImg.evaluate(node => node.src)).toBe(fifthImgHigh);
  expect(await fifthImg.evaluate(node => node.dataset.lowres)).toBe(fifthImgSrc);
});