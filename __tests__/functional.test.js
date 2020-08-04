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