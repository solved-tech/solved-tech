import puppeteer from '/workspace/design/homepage/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import { pathToFileURL } from 'url';
import path from 'path';

const chrome = '/usr/bin/google-chrome';
const dir = path.resolve('sketches');
const out = path.resolve('.');

const shots = [
  { file: 'sketch-1.html', png: 'sketch-1.png', w: 1440, h: 900 },
  { file: 'sketch-2.html', png: 'sketch-2.png', w: 1440, h: 900 },
  { file: 'sketch-3.html', png: 'sketch-3.png', w: 1440, h: 1200 },
];

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--font-render-hinting=none'],
});

for (const s of shots) {
  const page = await browser.newPage();
  await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: 1 });
  const url = pathToFileURL(path.join(dir, s.file)).href;
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.screenshot({ path: path.join(out, s.png), fullPage: false });
  console.log('shot', s.png);
  await page.close();
}
await browser.close();
