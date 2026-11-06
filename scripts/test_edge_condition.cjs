const http = require('http');
const { spawn } = require('child_process');

const CDP_PORT = 9405;
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\86166\\AppData\\Local\\Temp\\edge_eval_' + Date.now();

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

    // Check what the problem objects in memory ACTUALLY look like
    const testResult = await send('Runtime.evaluate', {
      expression: `(() => {
        // Find cards
        const cards = Array.from(document.querySelectorAll('.rounded-xl.border.transition.p-4'));
        const card8 = cards[7];
        const key = Object.keys(card8).find(k => k.startsWith('__reactFiber$'));
        let cur = card8[key];
        while (cur && !cur.memoizedProps?.problem) cur = cur.return;
        const prob = cur.memoizedProps.problem;

        // Test the condition
        const selectedCategory = '数组';
        const viewTrack = 'all';
        const cond1 = (selectedCategory !== 'all');
        const cond2 = (viewTrack === 'hot100');
        const cond3 = (prob.category !== selectedCategory && prob.topic !== selectedCategory);

        return JSON.stringify({
          prob_category: prob.category,
          prob_topic: prob.topic,
          cond1,
          cond2,
          cond3,
          shouldFilterOut: cond1 && !cond2 && cond3
        });
      })()`,
      returnByValue: true
    });
    console.log('Test result inside Edge:\n', testResult.result.value);

  } catch(e) {
    console.error('Error:', e);
  } finally {
    try { edge.kill(); } catch (e) {}
    process.exit(0);
  }
}, 1500);
