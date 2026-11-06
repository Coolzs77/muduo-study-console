const http = require('http');
const { spawn } = require('child_process');

const CDP_PORT = 9402;
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\86166\\AppData\\Local\\Temp\\edge_why_' + Date.now();

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

    // Click 数组 (20)
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const targetBtn = btns.find(b => b.innerText.trim().startsWith('数组'));
        if (targetBtn) targetBtn.click();
      })()`
    });
    await new Promise(r => setTimeout(r, 1000));

    // Now inspect in Edge: what are the props of all 49 AlgoCard components?
    const dumpCards = await send('Runtime.evaluate', {
      expression: `(() => {
        const cards = document.querySelectorAll('.rounded-xl.border.transition.p-4');
        return JSON.stringify(Array.from(cards).map((c, i) => {
          const key = Object.keys(c).find(k => k.startsWith('__reactFiber$'));
          let cur = c[key];
          while (cur && !cur.memoizedProps?.problem) {
            cur = cur.return;
          }
          const p = cur ? cur.memoizedProps.problem : null;
          return {
            index: i,
            id: p ? p.id : null,
            title: p ? p.title : null,
            category: p ? p.category : null,
            topic: p ? p.topic : null,
            isHot100: p ? p.isHot100 : null,
            hot100Chapter: p ? p.hot100Chapter : null
          };
        }));
      })()`,
      returnByValue: true
    });

    const items = JSON.parse(dumpCards.result.value);
    console.log('Total items rendered:', items.length);
    console.log('Item 8 (206):', items[7]);
    console.log('Item 9 (19):', items[8]);

  } catch(e) {
    console.error('Error:', e);
  } finally {
    try { edge.kill(); } catch (e) {}
    process.exit(0);
  }
}, 1500);
