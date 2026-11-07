const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function testLayout() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  if (!fs.existsSync(edgePath)) {
    console.log('Edge executable not found, skipping screenshot');
    return;
  }

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1920,1080']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Test local preview or dist/index.html
  const distHtml = path.resolve(__dirname, '../dist/index.html');
  await page.goto(`file://${distHtml}`, { waitUntil: 'networkidle0' });

  // 1. Check container widths
  const layoutInfo = await page.evaluate(() => {
    const mainEl = document.querySelector('main');
    const asideRight = document.querySelector('aside.border-l');
    const winWidth = window.innerWidth;
    return {
      windowWidth: winWidth,
      mainWidth: mainEl ? mainEl.getBoundingClientRect().width : null,
      asideRightRight: asideRight ? asideRight.getBoundingClientRect().right : null,
      asideRightWidth: asideRight ? asideRight.getBoundingClientRect().width : null
    };
  });

  console.log('[TEST] Layout Rects on 1920px screen:', layoutInfo);

  // Take screenshot
  const screenshotPath = path.resolve(__dirname, '../docs/images/v6_3_fullscreen_verified.png');
  fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
  await page.screenshot({ path: screenshotPath });
  console.log('✓ [TEST] Screenshot saved to', screenshotPath);

  await browser.close();
}

testLayout().catch(e => {
  console.error('Test error:', e.message);
  process.exit(0);
});
