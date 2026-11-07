const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const rootDir = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  
  const filePath = path.join(rootDir, reqPath);
  
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }
  
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

async function capture() {
  const PORT = 4175;
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`[Capture] Static server listening on port ${PORT}`);

  let browser;
  try {
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    browser = await puppeteer.launch({
      executablePath: edgePath,
      headless: 'new',
      args: ['--no-sandbox', '--window-size=1600,1050']
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 1050, deviceScaleFactor: 1 });

    console.log(`[Capture] Navigating to http://localhost:${PORT}/index.html ...`);
    await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle0', timeout: 15000 });

    await page.waitForFunction(() => {
      const el = document.getElementById('root');
      return el && el.innerHTML.includes('任务日历');
    }, { timeout: 8000 });

    // Allow CSS animations and fonts to settle
    await new Promise(r => setTimeout(r, 1000));

    const outDir = path.join(rootDir, 'docs', 'images');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    const screenshotPath = path.join(outDir, 'v6_9_full_claymorphism_dashboard.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`[Capture SUCCESS] Screenshot saved to: ${screenshotPath}`);

  } catch (err) {
    console.error('[Capture ERROR]', err);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
    server.close();
    console.log('[Capture] Done.');
  }
}

capture();
