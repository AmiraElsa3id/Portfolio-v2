/**
 * Captures the portfolio's own sections for the README.
 *
 * Distinct from take-screenshots.mjs, which grabs the *external* project sites
 * that fill the Projects grid. This one builds nothing and screenshots the
 * running app: hero plus one shot per section, exported as WebP to keep the
 * repository light.
 *
 * Usage: npm run screenshots:readme
 */
import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const outDir = resolve(root, 'docs/screenshots');

const PORT = 4319;
const BASE = `http://localhost:${PORT}`;
const VIEWPORT = { width: 1440, height: 900, deviceScaleFactor: 1 };

// Sections are lazy-loaded and animate in via IntersectionObserver, so each
// one has to be scrolled to and given time to settle before it is captured.
const sections = [
  { name: 'skills', selector: '#skills' },
  { name: 'experience', selector: '#experience' },
  { name: 'projects', selector: '#projects' },
  { name: 'education', selector: '#education' },
  { name: 'honors', selector: '#honors' },
  { name: 'contact', selector: '#contact' },
];

const MAX_SHOT_HEIGHT = 1400;
const settle = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForServer(timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(BASE);
      if (res.ok) return true;
    } catch {
      // server not up yet
    }
    await settle(300);
  }
  return false;
}

mkdirSync(outDir, { recursive: true });

const server = spawn(
  'npx',
  ['vite', 'preview', '--port', String(PORT), '--strictPort'],
  { cwd: root, shell: true, stdio: 'ignore' },
);

let browser;
try {
  if (!(await waitForServer())) {
    throw new Error(`preview server did not start on ${BASE}`);
  }

  browser = await puppeteer.launch({ headless: 'new', args: ['--font-render-hinting=none'] });
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  await page.goto(BASE, { waitUntil: 'networkidle2', timeout: 60000 });
  // Let the hero, marquee and cursor effect settle.
  await settle(2500);

  // Hero — the viewport at the top of the page.
  const hero = await sharp(
    await page.screenshot({ type: 'png' }),
  ).webp({ quality: 86 }).toBuffer();
  await sharp(hero).toFile(resolve(outDir, 'hero.webp'));
  console.log(`✓ hero.webp`);

  for (const { name, selector } of sections) {
    await page.waitForSelector(selector, { timeout: 30000 });

    // Scroll the section into view to fire its in-view animation, then return
    // to the top of the section so the capture is not mid-transition.
    await page.evaluate((sel) => {
      document.querySelector(sel)?.scrollIntoView({ behavior: 'instant', block: 'start' });
    }, selector);
    await settle(1600);

    const box = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x + window.scrollX, y: r.y + window.scrollY, width: r.width, height: r.height };
    }, selector);

    if (!box) {
      console.error(`✗ ${name}: section not found`);
      continue;
    }

    const height = Math.min(box.height, MAX_SHOT_HEIGHT);
    const shot = await page.screenshot({
      type: 'png',
      clip: { x: box.x, y: box.y, width: box.width, height },
      captureBeyondViewport: true,
    });

    await sharp(shot).webp({ quality: 86 }).toFile(resolve(outDir, `${name}.webp`));
    console.log(`✓ ${name}.webp`);
  }

  console.log(`\nScreenshots written to docs/screenshots/`);
} finally {
  await browser?.close();
  server.kill();
}