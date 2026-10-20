import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const srcImagePath = path.resolve('src/assets/images/lifemap_pwa_icon_1792512625717.jpg');
const publicDir = path.resolve('public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function run() {
  console.log('Generating PWA icons from:', srcImagePath);

  // 192x192
  await sharp(srcImagePath)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Generated pwa-192x192.png');

  // 512x512
  await sharp(srcImagePath)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Generated pwa-512x512.png');

  // apple-touch-icon 180x180
  await sharp(srcImagePath)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // Maskable icon 512x512 with safe-zone margin (scale to 80% and extend with dark navy background #141b2b)
  const innerSize = Math.round(512 * 0.82);
  const pad = Math.round((512 - innerSize) / 2);
  await sharp(srcImagePath)
    .resize(innerSize, innerSize)
    .extend({
      top: pad,
      bottom: pad,
      left: pad,
      right: pad,
      background: '#141b2b',
    })
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Generated pwa-maskable-512x512.png');

  // favicon.png (48x48)
  await sharp(srcImagePath)
    .resize(48, 48)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('Generated favicon.png');

  // Vector SVG icon for browser tab
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="22" fill="#0f172a"/>
  <path d="M 20 85 C 35 85, 45 65, 50 50 C 55 35, 65 25, 75 18" stroke="#f59e0b" stroke-width="8" stroke-linecap="round" fill="none"/>
  <polygon points="75,10 78,18 86,18 80,23 82,31 75,26 68,31 70,23 64,18 72,18" fill="#fbbf24"/>
  <circle cx="50" cy="50" r="7" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>
  <polygon points="50,45 52,50 50,55 48,50" fill="#fbbf24"/>
</svg>`;
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf-8');
  console.log('Generated icon.svg');

  console.log('All PWA assets generated successfully!');
}

run().catch(console.error);
