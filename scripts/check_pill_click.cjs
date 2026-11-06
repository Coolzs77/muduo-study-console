const http = require('http');
const { spawn } = require('child_process');

const CDP_PORT = 9404;
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\86166\\AppData\\Local\\Temp\\edge_btn_' + Date.now();

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

    // Before clicking any category, what are the category pill texts?
    const pills = await send('Runtime.evaluate', {
      expression: `(() => {
        const catDiv = document.querySelector('.overflow-x-auto.pb-1');
        return Array.from(catDiv.querySelectorAll('button')).map((b, i) => ({
          idx: i,
          text: b.innerText.trim(),
          className: b.className
        }));
      })()`,
      returnByValue: true
    });
    console.log('Category pills:', pills.result.value);

    // Click pill index 1 ('数组 (20)')
    await send('Runtime.evaluate', {
      expression: `(() => {
        const catDiv = document.querySelector('.overflow-x-auto.pb-1');
        const b = catDiv.querySelectorAll('button')[1];
        b.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));

    // Now what are the category pill states?
    const pillsAfter = await send('Runtime.evaluate', {
      expression: `(() => {
        const catDiv = document.querySelector('.overflow-x-auto.pb-1');
        return Array.from(catDiv.querySelectorAll('button')).map((b, i) => ({
          idx: i,
          text: b.innerText.trim(),
          className: b.className
        }));
      })()`,
      returnByValue: true
    });
    console.log('Category pills after clicking index 1:', pillsAfter.result.value);

    // Now what are the rendered card titles?
    const cardsAfter = await send('Runtime.evaluate', {
      expression: `(() => {
        const cards = document.querySelectorAll('.rounded-xl.border.transition.p-4');
        return Array.from(cards).map(c => c.querySelector('h3')?.innerText);
      })()`,
      returnByValue: true
    });
    console.log('Rendered cards count after clicking index 1:', cardsAfter.result.value.length);
    console.log('Rendered cards:', cardsAfter.result.value);

  } catch(e) {
    console.error('Error:', e);
  } finally {
    try { edge.kill(); } catch (e) {}
    process.exit(0);
  }
}, 1500);
