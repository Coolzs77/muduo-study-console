const http = require('http');
const { spawn } = require('child_process');

const CDP_PORT = 9401;
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\86166\\AppData\\Local\\Temp\\edge_fiber2_' + Date.now();

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

    // Find AlgoCatalog fiber
    const stateInfo = await send('Runtime.evaluate', {
      expression: `(() => {
        const h1 = document.querySelector('h1'); // 算法题库与刷题工作台
        const key = Object.keys(h1).find(k => k.startsWith('__reactFiber$'));
        let cur = h1[key];
        while (cur && !cur.memoizedState) {
          cur = cur.return;
        }
        // traverse hooks
        const hooks = [];
        let h = cur.memoizedState;
        while (h) {
          hooks.push(h.memoizedState);
          h = h.next;
        }
        return JSON.stringify({
          hook0: hooks[0], // viewTrack
          hook1: hooks[1], // searchQuery
          hook2: hooks[2], // selectedCategory
          hook3: hooks[3], // completedMap
          hook4_trackProblems_len: hooks[4] ? hooks[4].length : null,
          hook5_categories: hooks[5],
          hook6_counts: hooks[6],
          hook7_displayed_len: hooks[7] ? hooks[7].length : null,
          hook7_sample: hooks[7] ? hooks[7].slice(0, 10).map(x => ({ num: x.num, cat: x.category, topic: x.topic })) : null
        });
      })()`,
      returnByValue: true
    });
    console.log('AlgoCatalog Hooks State:\n', stateInfo.result.value);

  } catch(e) {
    console.error('Error:', e);
  } finally {
    try { edge.kill(); } catch (e) {}
    process.exit(0);
  }
}, 1500);
