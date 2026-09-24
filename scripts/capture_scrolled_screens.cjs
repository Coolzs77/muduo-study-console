const http = require('http');
const fs = require('fs');
const { spawn } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userDataDir = 'C:\\Users\\86166\\AppData\\Local\\Temp\\edge_screen_scrolled';

const edgeProcess = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9289',
  '--window-size=1600,1200',
  '--no-first-run',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
]);

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

setTimeout(async () => {
  try {
    const listRes = await fetchJson('http://127.0.0.1:9289/json/list');
    const pageTarget = listRes.find(t => t.type === 'page');
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
    let id = 1;

    function sendCmd(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        const handler = (event) => {
          const data = JSON.parse(event.data);
          if (data.id === msgId) {
            ws.removeEventListener('message', handler);
            resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    async function evaluate(js) {
      const res = await sendCmd('Runtime.evaluate', { expression: js, returnByValue: true, awaitPromise: true });
      return res?.result?.value;
    }

    ws.onopen = async () => {
      await sendCmd('Page.enable');
      await sendCmd('Page.navigate', { url: 'file:///e:/workspace/muduo-study-console/index.html' });
      await sleep(2500);

      await evaluate('switchView("knowledge")');
      await sleep(500);
      await evaluate('filterYuqueBook("muduo-core")');
      await sleep(500);
      await evaluate('selectYuqueArticle("yq_muduo_06")');
      await sleep(500);

      // Scroll reader down to see Channel code block and text
      await evaluate(`
        const reader = document.getElementById('yq-reader-body');
        if (reader) {
          reader.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      `);
      await sleep(800);

      const shotRes1 = await sendCmd('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('e:\\workspace\\muduo-study-console\\docs\\yuque_muduo\\live_muduo_doc06_body.png', Buffer.from(shotRes1.data, 'base64'));
      console.log('✓ Saved doc 06 body screenshot');

      // Now view doc 7 (AsyncLogging with double buffering images)
      await evaluate('selectYuqueArticle("yq_muduo_07")');
      await sleep(1000);
      const shotRes2 = await sendCmd('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('e:\\workspace\\muduo-study-console\\docs\\yuque_muduo\\live_muduo_doc07_tools.png', Buffer.from(shotRes2.data, 'base64'));
      console.log('✓ Saved doc 07 tools screenshot');

      ws.close();
      edgeProcess.kill();
      process.exit(0);
    };
  } catch(e) {
    console.error(e);
    edgeProcess.kill();
    process.exit(1);
  }
}, 1500);
