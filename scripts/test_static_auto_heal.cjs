const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const rootDir = path.resolve(__dirname, '..');

// 1. Create a pure static file server matching GitHub Pages behavior serving root dir
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
    console.log(`[Static Server 404] ${req.url}`);
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }
  
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': contentType });
  fs.createReadStream(filePath).pipe(res);
});

async function runTest() {
  const PORT = 4173;
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`✓ Pure static mock server listening on port ${PORT}`);

  let browser;
  try {
    const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
    browser = await puppeteer.launch({
      executablePath: edgePath,
      headless: 'new',
      args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    
    const consoleLogs = [];
    page.on('console', msg => consoleLogs.push(`[Browser ${msg.type()}]: ${msg.text()}`));
    page.on('pageerror', err => consoleLogs.push(`[Page Error]: ${err.message}`));
    
    console.log('Navigating to http://localhost:4173/index.html (simulating GitHub Pages serving repo root)...');
    await page.goto(`http://localhost:${PORT}/index.html`, { waitUntil: 'networkidle0', timeout: 15000 });

    // Wait up to 5 seconds for React to mount and render 仪表盘
    await page.waitForFunction(() => {
      const text = document.getElementById('root')?.innerText || '';
      return text.includes('仪表盘') || text.includes('任务日历');
    }, { timeout: 8000 });

    console.log('✓ React successfully mounted and replaced initial loader in static environment!');
    
    const hasRibbon = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('任务进度') && text.includes('专注遥测');
    });
    console.log(`✓ Has Telemetry Segmented Ribbon: ${hasRibbon}`);

    if (!hasRibbon) {
      throw new Error('Telemetry Ribbon not found in rendered DOM!');
    }

    console.log('🎉 STATIC AUTO-HEAL TEST PASSED 100%! The page loads flawlessly in pure static root hosting!');
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}

runTest().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
