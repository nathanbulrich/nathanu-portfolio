import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
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
    await session.send('Network.enable');
    await session.send('Network.setCacheDisabled', { cacheDisabled: true });
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
    const requests = [];
    await page.route('**/images/**', async (route) => {
      requests.push(route.request().url());
      await imageGate;
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
    const skeletonCount = await cards.locator('span[aria-hidden="true"]:visible').count();
    assert.equal(skeletonCount, width < 768 ? 5 : 15);
    // Capture directly: Playwright's screenshot font wait depends on the load
    // event, which is intentionally blocked by our held eager image responses.
    const capture = async (state) => {
      const { data } = await session.send('Page.captureScreenshot', { format: 'png' });
      await writeFile(`/tmp/project-${name}-${state}.png`, Buffer.from(data, 'base64'));
    };
    await capture('skeleton');
    releaseImages();
    await page.waitForFunction(() => Array.from(document.querySelectorAll('.card-border picture img'))
      .filter((img) => img.getBoundingClientRect().width > 0)
      .slice(0, window.innerWidth < 768 ? 1 : 3)
      .every((img) => img.complete && img.naturalWidth > 1));
    assert.deepEqual(await geometry(), before, 'Loading the first card must not move any card');
    await capture('loaded');
    for (let i = 0; i < await cards.count(); i++) {
      await cards.nth(i).scrollIntoViewIfNeeded();
      await page.waitForFunction((index) => Array.from(document.querySelectorAll('.card-border')[index]
        .querySelectorAll('picture img')).every((img) =>
          img.getBoundingClientRect().width === 0 || (img.complete && img.naturalWidth > 1)), i);
    }
    const after = await geometry();
    assert.deepEqual(after.map(({ height }) => height), before.map(({ height }) => height));
    assert.deepEqual(after.map(({ y }) => y - after[0].y), before.map(({ y }) => y - before[0].y));
    await page.waitForFunction(() => Array.from(document.querySelectorAll('.card-border span[aria-hidden="true"]'))
      .every((node) => node.getBoundingClientRect().width === 0));
    assert.equal(await cards.locator('span[aria-hidden="true"]:visible').count(), 0);
    assert.equal(requests.length, width < 768 ? 5 : 15, JSON.stringify(requests, null, 2));
    assert.ok(requests.every((url) => url.endsWith('.webp')), 'Only optimized project images should load');
    assert.deepEqual(errors, []);
    const cls = await page.evaluate(() => window.projectCLS);
    assert.ok(cls < 0.01, `Unexpected layout shift: ${cls}`);
    console.log(`${name}: ${requests.length} images, stable card geometry, CLS ${cls}`);
    await context.close();
  }
} finally {
  await browser.close();
}
