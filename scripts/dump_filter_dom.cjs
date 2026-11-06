const http = require('http');
const { spawn } = require('child_process');

const CDP_PORT = 9391;
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\86166\\AppData\\Local\\Temp\\edge_dump_' + Date.now();

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
    await send('Runtime.enable');
    await send('Page.navigate', { url: 'https://coolzs77.github.io/muduo-study-console/?v=' + Date.now() });
    await new Promise(r => setTimeout(r, 4000));

    // Switch to 算法题库
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.innerText.includes('算法题库'));
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));

    // Check all buttons
    const btnTexts = await send('Runtime.evaluate', {
      expression: `JSON.stringify(Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(t => t.length > 0))`,
      returnByValue: true
    });
    console.log('All buttons on page:', btnTexts.result.value);

    // Click 数组 (20)
    const clickRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const targetBtn = btns.find(b => b.innerText.trim().startsWith('数组'));
        if (targetBtn) {
          targetBtn.click();
          return { found: true, text: targetBtn.innerText.trim() };
        }
        return { found: false };
      })()`,
      returnByValue: true
    });
    console.log('Target button click:', clickRes.result.value);

    await new Promise(r => setTimeout(r, 1000));

    // Get all h3 tags
    const h3s = await send('Runtime.evaluate', {
      expression: `JSON.stringify(Array.from(document.querySelectorAll('h3')).map(h => h.innerText.trim()))`,
      returnByValue: true
    });
    console.log('Rendered H3s after clicking 数组:', h3s.result.value);

  } catch(e) {
    console.error('Error:', e);
  } finally {
    try { edge.kill(); } catch (e) {}
    process.exit(0);
  }
}, 1500);
