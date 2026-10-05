import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const urls = [
  { name: 'linked-posts', url: 'https://social-app-v2-eight.vercel.app', fullPage: true },
  { name: 'fresh-cart', url: 'https://fresh-cart-ecommerce-site.vercel.app', fullPage: true },
  // Route Academy weekly-session builds — captured at the card viewport so the
  // dense dashboards crop well inside the Projects grid.
  { name: 'ux-review', url: 'https://the-ux-review-blog.vercel.app/', fullPage: false },
  { name: 'mudabbir', url: 'https://mudabbir.vercel.app/', fullPage: false },
  { name: 'portfolio-route', url: 'https://portfolio-route.vercel.app/', fullPage: false },
  { name: 'cosmos-space', url: 'https://cosmos-space-dashboard-route.vercel.app/', fullPage: false },
  { name: 'quiz-master', url: 'https://quiz-master-route.vercel.app/', fullPage: false },
  { name: 'city-specs', url: 'https://city-specs-route.vercel.app/', fullPage: false },
  { name: 'freshcart-next', url: 'https://freshcart-route.vercel.app/', fullPage: false },
];

const outputDir = resolve(__dirname, '../public/assets/images');
mkdirSync(outputDir, { recursive: true });

const browser = await puppeteer.launch({ headless: 'new' });

for (const { name, url, fullPage } of urls) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 2500));
    await page.screenshot({ path: resolve(outputDir, `${name}.png`), fullPage });
    console.log(`✓ Screenshot saved: ${name}.png`);
  } catch (err) {
    console.error(`✗ Failed to screenshot ${name}: ${err.message}`);
  }
  await page.close();
}

await browser.close();
console.log('Done!');
