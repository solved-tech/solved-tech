import puppeteer from '/workspace/design/homepage/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import { pathToFileURL } from 'url';
import path from 'path';

const chrome = '/usr/bin/google-chrome';
const root = path.resolve('.');

const jobs = [
  { html: 'direction-2.html', out: 'direction-2.png', w: 1440, h: 900 },
  { html: 'direction-2.html', out: 'direction-2-mobile.png', w: 390, h: 844 },
];

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--font-render-hinting=none'],
});

for (const j of jobs) {
  const page = await browser.newPage();
  page.setDefaultTimeout(25000);
  await page.setViewport({ width: j.w, height: j.h, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(path.join(root, j.html)).href, {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  });
  await page.waitForSelector('#main');
  await new Promise(r => setTimeout(r, 500));
  await Promise.race([
    page.evaluate(() => Promise.all(
      [...document.images].filter(i => i.offsetParent !== null).map(img =>
        img.complete ? null : new Promise(r => { img.onload = img.onerror = r; })
      )
    )),
    new Promise(r => setTimeout(r, 3000)),
  ]);
  const hFull = await page.evaluate(() => Math.min(document.documentElement.scrollHeight, 5000));
  await page.screenshot({
    path: path.join(root, j.out),
    fullPage: false,
    clip: { x: 0, y: 0, width: j.w, height: hFull },
  });
  console.log('shot', j.out, j.w);
  await page.close();
}
await browser.close();
