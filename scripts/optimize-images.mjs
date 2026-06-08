import sharp from 'sharp';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { resolve, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
const inputDir = resolve(__dirname, '../public/assets/images');
const files = readdirSync(inputDir).filter(f => /\.(png|jpe?g)$/i.test(f));

for (const file of files) {
  const input = resolve(inputDir, file);
  const name = basename(file, extname(file));

  // Compress original
  const buf = readFileSync(input);
  const optimized = await sharp(buf)
    .resize(1280, 800, { fit: 'inside', withoutEnlargement: true })
    .png({ quality: 80, compressionLevel: 9 })
    .toBuffer();
  writeFileSync(input, optimized);
  console.log(`✓ Optimized: ${file} (${(buf.length / 1024).toFixed(0)}KB → ${(optimized.length / 1024).toFixed(0)}KB)`);

  // Generate WebP
  const webpBuf = await sharp(buf)
    .resize(1280, 800, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 75 })
    .toBuffer();
  writeFileSync(resolve(inputDir, `${name}.webp`), webpBuf);
  console.log(`  WebP: ${name}.webp (${(webpBuf.length / 1024).toFixed(0)}KB)`);
}

console.log('Done!');
