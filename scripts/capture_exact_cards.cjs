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
      await new Promise(r => setTimeout(r, 2000));

      // 1. Initial State Check (should be 0%)
      const initialText = await send('Runtime.evaluate', {
        expression: `document.getElementById('home-muduo-core-progress-content').innerText`,
        returnByValue: true
      });
      console.log('--- Step 1: Initial Muduo Core Card Text ---\n', initialText?.result?.value);

      // 2. Open article 1 without rating -> MUST REMAIN 0%
      await send('Runtime.evaluate', {
        expression: `selectYuqueArticle('yq_muduo_01');`
      });
      const textAfterOpen = await send('Runtime.evaluate', {
        expression: `document.getElementById('home-muduo-core-progress-content').innerText`,
        returnByValue: true
      });
      console.log('--- Step 2: After Simply Opening Article 1 (Must be 0%) ---\n', textAfterOpen?.result?.value);

      // 3. Mark article 1 as L1 (了解) -> MUST BECOME 1/10 (10%)
      await send('Runtime.evaluate', {
        expression: `setYuqueMastery('yq_muduo_01', 1);`
      });
      const textAfterL1 = await send('Runtime.evaluate', {
        expression: `document.getElementById('home-muduo-core-progress-content').innerText`,
        returnByValue: true
      });
      console.log('--- Step 3: After Setting Article 1 to L1 (Must be 1/10 10%) ---\n', textAfterL1?.result?.value);

      // 4. Mark article 1 back to L0 (未学习) -> MUST REVERT TO 0/10 (0%)
      await send('Runtime.evaluate', {
        expression: `setYuqueMastery('yq_muduo_01', 0);`
      });
      const textAfterRevertL0 = await send('Runtime.evaluate', {
        expression: `document.getElementById('home-muduo-core-progress-content').innerText`,
        returnByValue: true
      });
      console.log('--- Step 4: After Reverting Article 1 to L0 未学习 (Must be 0/10 0%) ---\n', textAfterRevertL0?.result?.value);

      // 5. Finally, set article 1 (L3) and article 6 (L4)
      await send('Runtime.evaluate', {
        expression: `(() => {
          setYuqueMastery('yq_muduo_01', 3);
          selectYuqueArticle('yq_muduo_06');
          setYuqueMastery('yq_muduo_06', 4);
          switchView('dashboard');
        })()`
      });
      await new Promise(r => setTimeout(r, 400));

      const updatedText = await send('Runtime.evaluate', {
        expression: `document.getElementById('home-muduo-core-progress-content').innerText`,
        returnByValue: true
      });
      console.log('--- Updated Muduo Core Card Text ---\n', updatedText?.result?.value);

      await send('Runtime.evaluate', {
        expression: `document.getElementById('home-zone-project-progress').scrollIntoView({ behavior: 'instant', block: 'start' });`
      });
      await new Promise(r => setTimeout(r, 400));

      const rects = await send('Runtime.evaluate', {
        expression: `(() => {
          const p = document.getElementById('home-zone-project-progress').getBoundingClientRect();
          const core = document.getElementById('home-zone-muduo-core-progress').getBoundingClientRect();
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

      const clip = JSON.parse(rects.result.value);
      clip.scale = 1;

      const screenshot = await send('Page.captureScreenshot', {
        format: 'png',
        clip
      });

      fs.writeFileSync('C:\\Users\\86166\\.gemini\\antigravity\\brain\\8bc797ee-2187-43ad-8786-88c3d69229a7\\live_both_progress_cards.png', Buffer.from(screenshot.data, 'base64'));
      console.log('✓ Successfully saved updated live_both_progress_cards.png');

      edge.kill();
      process.exit(0);
    };
  } catch(e) {
    console.error(e);
    edge.kill();
    process.exit(1);
  }
}, 1500);
