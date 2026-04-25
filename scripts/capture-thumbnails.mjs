import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { sites, slugForUrl } from "../src/app/sites/sites-data.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "images", "site-thumbnails");

const VIEWPORT = { width: 1280, height: 800 };
const SOURCE = { width: 640, height: 400 };
const QUALITY = 80;
const NAV_TIMEOUT = 15000;

async function captureSite(browser, site) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2,
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();
  try {
    try {
      await page.goto(`https://${site.url}`, {
        waitUntil: "networkidle",
        timeout: NAV_TIMEOUT,
      });
    } catch (navErr) {
      if (navErr.message.includes("Timeout")) {
        await page.goto(`https://${site.url}`, {
          waitUntil: "domcontentloaded",
          timeout: NAV_TIMEOUT,
        });
        await page.waitForTimeout(2000);
      } else {
        throw navErr;
      }
    }
    if (site.waitMs) await page.waitForTimeout(site.waitMs);
    const buffer = await page.screenshot({ type: "png", fullPage: false });
    const webp = await sharp(buffer)
      .resize(SOURCE.width, SOURCE.height, { fit: "cover", position: "top" })
      .webp({ quality: QUALITY })
      .toBuffer();
    const outPath = join(OUT_DIR, `${slugForUrl(site.url)}.webp`);
    await writeFile(outPath, webp);
    const sizeKb = (webp.byteLength / 1024).toFixed(1);
    console.log(`  ✓ ${site.url} → ${outPath.split("/").pop()} (${sizeKb} KB)`);
    return { ok: true, site };
  } catch (err) {
    console.log(`  ✗ ${site.url} — ${err.message}`);
    return { ok: false, site, error: err };
  } finally {
    await context.close();
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  console.log(`Capturing ${sites.length} sites → ${OUT_DIR}\n`);
  const results = [];
  for (const site of sites) {
    const result = await captureSite(browser, site);
    results.push(result);
  }
  await browser.close();
  const failed = results.filter((r) => !r.ok);
  console.log(`\nDone. ${results.length - failed.length} ok, ${failed.length} failed.`);
  if (failed.length) {
    console.log("Failures:");
    for (const f of failed) console.log(`  - ${f.site.url}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
