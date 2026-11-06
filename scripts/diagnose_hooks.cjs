const http = require('http');
const { spawn } = require('child_process');

const CDP_PORT = 9403;
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\86166\\AppData\\Local\\Temp\\edge_why2_' + Date.now();

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

    // Inspect AlgoCatalog parent fiber
    const checkAlgoCatalog = await send('Runtime.evaluate', {
      expression: `(() => {
        // Find the problem container
        const card1 = document.querySelector('.rounded-xl.border.transition.p-4');
        const key = Object.keys(card1).find(k => k.startsWith('__reactFiber$'));
        let cur = card1[key];
        // traverse up until AlgoCatalog
        while (cur && (!cur.type || typeof cur.type !== 'function' || !cur.memoizedState)) {
          cur = cur.return;
        }
        if (!cur) return 'NO_PARENT_FUNC';

        // cur is AlgoCatalog
        // Traverse memoizedState linked list
        const states = [];
        let s = cur.memoizedState;
        while (s) {
          states.push({
            type: typeof s.memoizedState,
            val: typeof s.memoizedState === 'string' ? s.memoizedState : (Array.isArray(s.memoizedState) ? 'Array(' + s.memoizedState.length + ')' : (typeof s.memoizedState === 'object' ? Object.keys(s.memoizedState || {}) : s.memoizedState))
          });
          s = s.next;
        }
        return JSON.stringify(states);
      })()`,
      returnByValue: true
    });

    console.log('AlgoCatalog Hooks MemoizedState list:\n', checkAlgoCatalog.result.value);

  } catch(e) {
    console.error('Error:', e);
  } finally {
    try { edge.kill(); } catch (e) {}
    process.exit(0);
  }
}, 1500);
