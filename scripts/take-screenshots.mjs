import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const urls = [
  { name: 'linked-posts', url: 'https://social-app-v2-eight.vercel.app' },
  { name: 'fresh-cart', url: 'https://fresh-cart-ecommerce-site.vercel.app' },
];

const outputDir = resolve(__dirname, '../public/assets/images');
mkdirSync(outputDir, { recursive: true });

const browser = await puppeteer.launch({ headless: 'new' });

for (const { name, url } of urls) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await page.screenshot({ path: resolve(outputDir, `${name}.png`), fullPage: true });
    console.log(`✓ Screenshot saved: ${name}.png`);
  } catch (err) {
    console.error(`✗ Failed to screenshot ${name}: ${err.message}`);
  }
  await page.close();
}

await browser.close();
console.log('Done!');
