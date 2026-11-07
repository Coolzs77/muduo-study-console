const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const distDir = path.resolve(__dirname, '../dist');

// Create simple static server
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const contentTypes = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.svg': 'image/svg+xml',
      '.png': 'image/png'
    };
    res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
    res.end(fs.readFileSync(filePath));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(4173, async () => {
  console.log('[TEST-SERVER] Listening on http://localhost:4173');
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  
  const consoleMessages = [];
  const pageErrors = [];
  page.on('console', msg => consoleMessages.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => pageErrors.push(err.message));

  try {
    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle0', timeout: 15000 });
    const rootHtml = await page.evaluate(() => document.getElementById('root')?.innerHTML?.slice(0, 300));
    console.log('[TEST-RESULT] Console Messages:', consoleMessages);
    console.log('[TEST-RESULT] Page Errors:', pageErrors);
    console.log('[TEST-RESULT] Root innerHTML:', rootHtml);
  } catch (e) {
    console.error('Goto error:', e.message);
  } finally {
    await browser.close();
    server.close();
  }
});
