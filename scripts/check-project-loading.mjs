import assert from 'node:assert/strict';
import { chromium } from 'playwright';

// Run against a production server: npm run start -- --port 3001
const baseURL = process.env.TEST_BASE_URL || 'http://127.0.0.1:3001';
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
  executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH || undefined,
  timeout: 15000,
});
try {
  for (const [name, width, height, deviceScaleFactor] of [
    ['mobile', 390, 844, 2],
    ['tablet', 820, 1180, 2],
    ['desktop', 1440, 1000, 2],
  ]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const session = await context.newCDPSession(page);
    await session.send('Network.emulateNetworkConditions', {
      offline: false, latency: 150, downloadThroughput: 200 * 1024, uploadThroughput: 100 * 1024,
    });
    await page.addInitScript(() => {
      window.projectCLS = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.projectCLS += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });
    // Exclude optional external fonts so this measures the local page and images.
    await page.route('https://fonts.googleapis.com/**', (route) => route.abort());
    let releaseImages;
    const imageGate = new Promise((resolve) => { releaseImages = resolve; });
    let releaseLastImage;
    const lastImageGate = new Promise((resolve) => { releaseLastImage = resolve; });
    const requests = [];
    // Routing disables the HTTP cache, so every context tests a cold load.
    await page.route('**/images/**', async (route) => {
      requests.push(route.request().url());
      await imageGate;
      // The third Cosmos screenshot deliberately arrives after the others.
      if (route.request().url().includes('/cosmos-1-')) await lastImageGate;
      await route.continue();
    });
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
    const cards = page.locator('.card-border');
    await cards.first().locator('picture img').first().waitFor();
    assert.equal(await cards.count(), 5);
    const geometry = () => cards.evaluateAll((nodes) => nodes.map((node) => {
      const { x, y, width, height } = node.getBoundingClientRect();
      return { x, y: y + window.scrollY, width, height };
    }));
    const before = await geometry();
    for (const card of before) assert.ok(card.height > 300, 'Cards must reserve image space before loading');
    assert.equal(await cards.locator('.project-image-skeleton:visible').count(), width < 768 ? 5 : 15);
    releaseImages();
    await page.waitForFunction(() => document.querySelector('.project-image-group').dataset.mobileReady === 'true');
    if (width >= 768) {
      const opacities = await cards.first().locator('picture img').evaluateAll((images) =>
        images.map((img) => getComputedStyle(img).opacity));
      assert.deepEqual(opacities, ['0', '0', '0'], 'Early screenshots must stay hidden until the whole row is decoded');
      assert.equal(await cards.first().locator('.project-image-skeleton:visible').count(), 3);
    }
    releaseLastImage();
    for (let i = 0; i < await cards.count(); i++) {
      await cards.nth(i).scrollIntoViewIfNeeded();
      await page.waitForFunction((index) => Array.from(document.querySelectorAll('.card-border')[index]
        .querySelectorAll('picture img')).every((img) =>
          img.getBoundingClientRect().width === 0 || (img.complete && img.naturalWidth > 1 && getComputedStyle(img).opacity === '1')), i);
    }
    const after = await geometry();
    assert.deepEqual(after.map(({ height }) => height), before.map(({ height }) => height));
    assert.deepEqual(after.map(({ y }) => y - after[0].y), before.map(({ y }) => y - before[0].y));
    assert.equal(await cards.locator('.project-image-skeleton:visible').count(), 0);
    assert.equal(requests.length, width < 768 ? 5 : 15, JSON.stringify(requests, null, 2));
    assert.ok(requests.every((url) => url.endsWith('.webp')), 'Only optimized project images should load');
    assert.deepEqual(errors, []);
    const cls = await page.evaluate(() => window.projectCLS);
    assert.ok(cls < 0.01, `Unexpected layout shift: ${cls}`);
    console.log(`${name}: ${requests.length} images, synchronized reveal, stable card geometry, CLS ${cls}`);
    await context.close();
  }
} finally {
  await browser.close();
}
