const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const CDP_PORT = 9388;
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\86166\\AppData\\Local\\Temp\\edge_live_' + Date.now();

const edge = spawn(edgePath, [
  '--headless=new',
  `--remote-debugging-port=${CDP_PORT}`,
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

setTimeout(async () => {
  try {
    const listRes = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${CDP_PORT}/json/list`, r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });

    const target = listRes.find(t => t.type === 'page') || listRes[0];
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    let id = 1;
    function send(method, params = {}) {
      return new Promise(resolve => {
        const msgId = id++;
        const fn = (e) => {
          const d = JSON.parse(e.data);
          if (d.id === msgId) {
            ws.removeEventListener('message', fn);
            resolve(d.result);
          }
        };
        ws.addEventListener('message', fn);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await new Promise(r => ws.addEventListener('open', r));
    await send('Page.enable');
    console.log('[CDP] Navigating to live GitHub Pages: https://coolzs77.github.io/muduo-study-console/ ...');
    await send('Page.navigate', { url: 'https://coolzs77.github.io/muduo-study-console/' });
    await new Promise(r => setTimeout(r, 6000));

    const titleRes = await send('Runtime.evaluate', { expression: 'document.title', returnByValue: true });
    const navRes = await send('Runtime.evaluate', {
      expression: 'Array.from(document.querySelectorAll("header nav button")).map(b => b.innerText.trim())',
      returnByValue: true
    });
    const bodyText = await send('Runtime.evaluate', {
      expression: 'document.body.innerText.slice(0, 500)',
      returnByValue: true
    });

    console.log('PAGE TITLE:', titleRes.result.value);
    console.log('HEADER TABS:', JSON.stringify(navRes.result.value));
    console.log('BODY TEXT PREVIEW:\n' + bodyText.result.value);

    // Save screenshot
    const scr = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('docs/live_screenshot_deployed.png', Buffer.from(scr.data, 'base64'));
    console.log('[PROOF] Screenshot saved to docs/live_screenshot_deployed.png');
  } catch(e) {
    console.error('Failure:', e);
  } finally {
    try { edge.kill(); } catch (e) {}
    process.exit(0);
  }
}, 1500);
