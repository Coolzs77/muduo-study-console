const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const CDP_PORT = 9389;
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\86166\\AppData\\Local\\Temp\\edge_filter_' + Date.now();

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

    // Click "算法题库" tab
    console.log('Clicking 算法题库 tab...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = Array.from(document.querySelectorAll('header nav button')).find(b => b.innerText.includes('算法题库'));
        if (btn) btn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));

    // Get current rendered problem titles before clicking 数组
    const beforeTitles = await send('Runtime.evaluate', {
      expression: `Array.from(document.querySelectorAll('h3, .font-bold.text-sm')).map(el => el.innerText.trim()).filter(t => t.includes('.'))`,
      returnByValue: true
    });
    console.log('Problems before filter:', beforeTitles.result.value.slice(0, 5));

    // Click "数组 (20)" button
    console.log('Clicking 数组 (20) category pill...');
    const clickResult = await send('Runtime.evaluate', {
      expression: `(() => {
        const pills = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('数组'));
        if (pills.length > 0) {
          pills[0].click();
          return { clicked: true, text: pills[0].innerText };
        }
        return { clicked: false };
      })()`,
      returnByValue: true
    });
    console.log('Click result:', clickResult.result.value);

    await new Promise(r => setTimeout(r, 1000));

    // Get rendered problem titles AFTER clicking 数组
    const afterTitles = await send('Runtime.evaluate', {
      expression: `Array.from(document.querySelectorAll('.font-bold.text-sm, h3')).map(el => el.innerText.trim()).filter(t => t.includes('.'))`,
      returnByValue: true
    });
    console.log('Problems AFTER clicking 数组:', afterTitles.result.value.slice(0, 10));

    // Capture screenshot
    const scr = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('docs/screenshot_filter_test.png', Buffer.from(scr.data, 'base64'));
    console.log('Screenshot saved to docs/screenshot_filter_test.png');

  } catch(e) {
    console.error('Error during filter test:', e);
  } finally {
    try { edge.kill(); } catch (e) {}
    process.exit(0);
  }
}, 1500);
