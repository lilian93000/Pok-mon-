// Rend intro.html image par image puis encode en MP4 avec ffmpeg.
const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FPS = 30, DURATION = 5;
const dir = __dirname;
const frames = path.join(process.argv[2] || path.join(dir, 'frames'));

(async () => {
  fs.rmSync(frames, { recursive: true, force: true });
  fs.mkdirSync(frames, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + path.join(dir, 'intro.html'));
  await page.evaluate(() => document.fonts.ready);
  for (let i = 0; i < FPS * DURATION; i++) {
    await page.evaluate(t => window.render(t), i / FPS);
    await page.screenshot({ path: path.join(frames, `f${String(i).padStart(4, '0')}.png`) });
  }
  await browser.close();
  execSync(`ffmpeg -y -loglevel error -framerate ${FPS} -i ${frames}/f%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart ${path.join(dir, 'intro-analysetacopro.mp4')}`);
  console.log('ok');
})();
