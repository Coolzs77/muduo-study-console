const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\86166\\AppData\\Local\\Temp\\edge_box_' + Date.now();

const edge = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9299',
  '--window-size=1600,1200',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

setTimeout(async () => {
  try {
    const listRes = await new Promise((resolve, reject) => {
      http.get('http://127.0.0.1:9299/json/list', r => {
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
          if (d.id === msgId) { ws.removeEventListener('message', fn); resolve(d.result); }
        };
        ws.addEventListener('message', fn);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    ws.onopen = async () => {
      await send('Page.enable');
      await send('Page.navigate', { url: 'file:///e:/workspace/muduo-study-console/index.html' });
      await new Promise(r => setTimeout(r, 2500));

      await send('Runtime.evaluate', {
        expression: `document.getElementById('home-zone-project-progress').scrollIntoView({ behavior: 'instant', block: 'start' });`
      });
      await new Promise(r => setTimeout(r, 500));

      const rects = await send('Runtime.evaluate', {
        expression: `(() => {
          const p = document.getElementById('home-zone-project-progress').getBoundingClientRect();
          const m = document.getElementById('home-zone-muduo-progress').getBoundingClientRect();
          return JSON.stringify({
            x: Math.round(window.scrollX + p.left - 10),
            y: Math.round(window.scrollY + p.top - 10),
            width: Math.round(p.width + 20),
            height: Math.round((m.bottom - p.top) + 20)
          });
        })()`,
        returnByValue: true
      });
      console.log('Absolute page rect:', rects?.result?.value);

      const clip = JSON.parse(rects.result.value);
      clip.scale = 1;

      const screenshot = await send('Page.captureScreenshot', {
        format: 'png',
        clip
      });

      fs.writeFileSync('C:\\Users\\86166\\.gemini\\antigravity\\brain\\8bc797ee-2187-43ad-8786-88c3d69229a7\\live_both_progress_cards.png', Buffer.from(screenshot.data, 'base64'));
      console.log('✓ Saved live_both_progress_cards.png');

      edge.kill();
      process.exit(0);
    };
  } catch(e) {
    console.error(e);
    edge.kill();
    process.exit(1);
  }
}, 1500);
